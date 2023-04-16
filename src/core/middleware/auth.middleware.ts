import { Injectable, NestMiddleware } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/services/user.service';
import { CustomException } from '../exceptions/custom.exception';

export interface IUserRequest extends Request {
  auth: {
    userId: number;
    userName: string;
    ticket: string;
    role: number;
  };
}
@Injectable()
export class SSOMiddleware implements NestMiddleware {
  @Inject(UserService)
  private readonly userService: UserService;
  private async checkLoginInfo(req: Request): Promise<{
    userId: number;
    userName: string;
    role: number;
    ticket: string;
  }> {
    const ticket = req.headers['ticket'] || req.cookies['ticket'];
    if (!ticket) {
      throw new CustomException({
        message: 'ticket为空,请重新登陆',
      });
    }

    const userData = await this.userService.getUserDataByTicket(ticket);

    if (!userData) {
      throw new CustomException({
        message: '身份信息失效,请重新登陆',
      });
    }
    return {
      userId: userData.id,
      userName: userData.userName,
      role: userData.role,
      ticket,
    };
  }
  async use(
    req: IUserRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (!req.auth) {
      req.auth = {
        userId: 0,
        userName: '',
        ticket: '',
        role: 1,
      };
    }

    try {
      const loginInfo = await this.checkLoginInfo(req);
      req.auth.userId = loginInfo.userId;
      req.auth.userName = loginInfo.userName;
      req.auth.role = loginInfo.role;
      req.auth.ticket = loginInfo.ticket;
      next();
    } catch (err) {
      next(err);
    }
  }
}
