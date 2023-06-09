import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { TransformResInterceptor } from './core/interceptors/transform-res.intercepror';
import { SSOMiddleware } from './core/middleware/auth.middleware';
import { ClsMiddleware } from './core/middleware/cls.middleware';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';
import { ToolModule } from './tool/tool.module';
import { BillModule } from './bill/bill.module';
import { PCModule } from './parkingCharge/pc.module';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig as TypeOrmModule),
    UserModule,
    RoomModule,
    ToolModule,
    BillModule,
    PCModule,
    ComplaintModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    SSOMiddleware,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SSOMiddleware)
      .exclude(
        {
          path: '/user/register',
          method: RequestMethod.ALL,
        },
        {
          path: '/user/login',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(ClsMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
