import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { UserService } from '../services/user.service';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '../entities/user.entity';
import { IHttpResultPaginate } from '../services/audit-user.service';
import { UserListDto } from '../dto/user-list.dto';
import { RolesGuard } from '../guards/is-admin.guard';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
@Controller('/user')
export class UserController {
  @Inject(UserService)
  protected readonly service: UserService;
  @Post('/create')
  async create(@Body() registeredUserDto: RegisteredUser): Promise<void> {
    return this.service.create(registeredUserDto);
  }
  @Post('/login')
  async login(
    @Body() loginUser: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
      const returnData = await this.service.login(loginUser);
      const { code, message, ticket } = returnData;
      if (code === HttpStatus.OK) {
        res.cookie('ticket', ticket, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      }
      res.json({ code, message });
  }

  @Post('/exit')
  async exit(@Res() res: Response): Promise<void> {
    await res.clearCookie('ticket');
    res.status(HttpStatus.OK).json({
      code: 200,
      message: 'success',
    });
  }

  @Post('/getUserInfo')
  async getUserInfo(@Req() req: Request): Promise<User> {
    const ticket = req.cookies['ticket'];
    return this.service.getUserDataByTicket(ticket);
  }

  @Post('/getUserList')
  async getUserList(
    @Body() userListDto: UserListDto,
  ): Promise<IHttpResultPaginate<User>> {
    return this.service.getUserList(userListDto);
  }

  @Post('/changeUserStatus')
  @UseGuards(RolesGuard)
  async changeUserStatus(
    @Body() changeUserStatusDto: ChangeUserStatusDto,
  ): Promise<User> {
    return this.service.changeUserStatus(changeUserStatusDto);
  }
}
