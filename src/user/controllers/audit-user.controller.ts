import {
    Body,
    Controller,
    Inject,
    Post,
    UseGuards,
  } from '@nestjs/common';
import { AuditUserDto } from '../dto/audit-user.dto';
import { AuditUserListDto } from '../dto/list-user-audit.dto';
  import { RegisteredUser } from '../dto/registered-user.dto';
import { AuditStatus, UserAudit } from '../entities/user.audit.entity';
import { RolesGuard } from '../guards/is-admin.guard';
import { IHttpResultPaginate, UserAuditService } from '../services/audit-user.service';
  @Controller('/user/audit')
  export class UserAuditController {
    @Inject(UserAuditService)
    protected readonly service:UserAuditService

    @Post('/auditList')
    @UseGuards(RolesGuard)
    async getAuditList(@Body()auditUserListDto:AuditUserListDto):Promise<IHttpResultPaginate<UserAudit>>{
      return this.service.getAuditList(auditUserListDto)
    }

    @Post('/resolve')
    @UseGuards(RolesGuard)
    async resolve(@Body() auditUserDto:AuditUserDto ): Promise<void> {
      return this.service.resolve(auditUserDto);
    }
  }

  