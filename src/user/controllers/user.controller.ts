import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisteredUser } from '../dto/registered-user.dto';
import { UserService } from '../services/user.service';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '../entities/user.entity';
import { UserListDto } from '../dto/user-list.dto';
import { RolesGuard } from '../guards/is-admin.guard';
import { ChangeUserStatusDto } from '../dto/change-user-status.dto';
@Controller('/user')
@UsePipes(new ValidationPipe())
export class UserController {
  @Inject(UserService)
  protected readonly service: UserService;
  @Post('/register')
  async create(@Body() registeredUserDto: RegisteredUser): Promise<void> {
    return this.service.create(registeredUserDto);
  }

  @Post('/login')
  async login(
    @Body() loginUser: LoginUserDto,
  ): Promise<{ code: number; message: string; ticket?: string }> {
    return this.service.login(loginUser);
    // const { code, message, ticket } = returnData;
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
  async getUserInfo(@Body('ticket') ticket: string): Promise<User> {
    // const ticket = req.cookies['ticket'];
    return this.service.getUserDataByTicket(ticket);
  }

  @Post('/getUserList')
  async getUserList(@Body() userListDto: UserListDto): Promise<User[]> {
    return this.service.getUserList(userListDto);
  }
}
