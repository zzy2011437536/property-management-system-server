import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorCode } from '../constants/error';

const exceptions = ['Custom Exception', 'Auth Exception', 'Params Exception'];
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: any = host.switchToHttp();
    const response = ctx.getResponse();
    let errorCode;
    let message = exception.message;
    if (exception instanceof HttpException) {
      const exceptionResponse: any = exception.getResponse();
      console.log(exceptionResponse)
      errorCode =
        exceptionResponse?.error?.errorCode ??
        exceptionResponse?.error?.code ??
        exceptionResponse?.errorCode ??
        exceptionResponse.code;

      message =
        exceptionResponse?.error?.data?.errmsg ??
        exceptionResponse?.error?.message ??
        exceptionResponse?.message ??
        message;
    } else {
      errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (ErrorCode.HasCode(errorCode)) {
      message =
        exceptions.indexOf(message) > -1
          ? ErrorCode.CodeToMessage(errorCode)
          : message || ErrorCode.CodeToMessage(errorCode);
    } else {
      message = message || ErrorCode.ERROR.MESSAGE;
    }
    response.status(HttpStatus.OK).json({
      code: errorCode ?? exception.getStatus(),
      message,
      data: `${exception.message}||${JSON.stringify(exception.stack)}`,
    });
  }
}
