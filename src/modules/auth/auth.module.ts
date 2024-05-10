import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
// import { AuthStrategy } from './auth.strategy';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [PassportModule, SystemModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
