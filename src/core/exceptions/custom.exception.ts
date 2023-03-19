import { HttpException,HttpStatus } from "@nestjs/common";
import { ErrorCode } from "../constants/error";

export type TExceptionOption = {
    message?:string;
    errorCode?:number;
}

export class CustomException extends HttpException{
    constructor(errorOptions:TExceptionOption){
        if(typeof errorOptions.errorCode==='undefined' ){
            errorOptions.errorCode = ErrorCode.ERROR.CODE
        }
        super(errorOptions,HttpStatus.OK)
    }
    }
