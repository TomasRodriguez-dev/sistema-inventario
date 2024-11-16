import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response, Request } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const exceptionResponse: any = exception.getResponse();
        const message = 
            exceptionResponse.message instanceof Array
                ? exceptionResponse.message
                : [exceptionResponse.message];

        response.status(status).json({
            statusCode: status,
            message: message.length > 0 ? message : exception.message,
            timestamp: new Date().toISOString(),
            path: request.url
        })
    }
}