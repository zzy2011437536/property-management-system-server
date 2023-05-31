import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';
const clsNameSpace = cls.createNamespace('app');
@Injectable()
export class ClsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    clsNameSpace.bindEmitter(req);
    clsNameSpace.bindEmitter(res);
    const userName = req.auth?.userName || 'zhuzhiyuan';
    const role = req.auth?.role || 1;
    const userId = req.auth?.userId || 0;
    const vipLevel = req.auth?.vipLevel || 'v1';
    clsNameSpace.run(() => {
      clsNameSpace.set('userName', userName);
      clsNameSpace.set('role', role);
      clsNameSpace.set('userId', userId);
      clsNameSpace.set('vipLevel', vipLevel);
      next();
    });
  }
}
