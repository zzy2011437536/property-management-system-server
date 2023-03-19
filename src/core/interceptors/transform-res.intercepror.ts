import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { BadRequestException, InternalServerErrorException, RequestTimeoutException } from "@nestjs/common/exceptions";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ErrorCode } from "../constants/error";

@Injectable()
export class TransformResInterceptor implements NestInterceptor {
  intercept(context:ExecutionContext, next:CallHandler) {
    return next
      .handle()
      .pipe(
        map(async (data:any)=>{
            if(typeof data?.statusCode ==='undefined'){
                return {
                    code:ErrorCode.SUCCESS.CODE,
                    message:ErrorCode.SUCCESS.MESSAGE,
                    data,
                }   
            }
            let errorCode,message;
            if(ErrorCode.HasCode(data.statusCode)){
                errorCode = data.statusCode;
                message = data.message?data.message:ErrorCode.CodeToMessage(errorCode)
            }else{
                errorCode = data.statusCode?data.statusCode:ErrorCode.ERROR.CODE;
                message = data.message?data.message:ErrorCode.ERROR.MESSAGE
            }
            return {
                code:errorCode,
                message,
                data:data.data?data.data:null
            }
        }),
        catchError((err:any)=>{
            const {response,request,message,stack} = err
            let e;
            if(response){
                e = new BadRequestException(message,response)
            }else if(request){
                e = new RequestTimeoutException(message)
            }else{
                e = new InternalServerErrorException(message)
            }
            if(stack) e.stack = stack
            return throwError(e)
        }),
      );
  }
}