import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user.entity";
import { UserService } from "./services/user.service";
import { UserAudit } from "./entities/user.audit.entity";
import { UserAuditController } from "./controllers/audit-user.controller";
import { UserAuditService } from "./services/audit-user.service";

@Module({
    imports: [
      TypeOrmModule.forFeature([User,UserAudit])
    ],
    providers:[UserService,UserAuditService],
    controllers: [UserController,UserAuditController],
    exports:[UserService,UserAuditService]
  })
  export class UserModule {}