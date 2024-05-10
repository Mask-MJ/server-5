import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../system/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private userService: UserService,
  ) {}

  async validateUser(account: string, pass: string): Promise<any> {
    console.log('account', account);
    // const user = await this.userService.findOneByAccount(account);
    // if (user && user.password === pass) {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
  }

  // async login(user: User) {
  //   const payload = { account: user.account, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
