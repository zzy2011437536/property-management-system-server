import * as express from 'express';
type middleware = () => any;
declare module 'express' {
  export interface Request {
    auth: {
      userName: string;
      role: number;
      userId: number;
      vipLevel: string;
    };
  }
}
