import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../app/user.service';
import { LoginBodyDto, SignupBodyDto } from './user.dto';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/signup')
  async signup(@Body() body: SignupBodyDto) {
    await this.service.signup(body);
    return sendSuccessRes(null);
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto) {
    const token = await this.service.login(body);
    return sendSuccessRes({ accessToken: token.accessToken });
  }
}
