import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../app/user.service';
import { LoginBodyDto, SignupBodyDto } from './user.dto';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/signup')
  async signup(@Body() body: SignupBodyDto) {
    const result = await this.service.signup(body);
    if (result === -1) return sendFailRes('이미 가입된 이메일입니다.');
    if (result === -2) return sendFailRes('이미 가입된 이름입니다.');

    return sendSuccessRes(null);
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto) {
    const result = await this.service.login(body);
    if (result === -1) return sendFailRes('일치하는 계정 정보가 없습니다.');

    return sendSuccessRes(result);
  }

  @Post('/refresh-access-token')
  async refreshAccessToken(@Body() body: { refreshToken: string }) {
    const result = await this.service.refreshAccessToken(body.refreshToken);

    return sendSuccessRes(result);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() { user }: Request) {
    // TODO: 구현 필요

    return sendSuccessRes(null);
  }

  @Post('/leave')
  @UseGuards(JwtAuthGuard)
  async leave(@Req() { user }: Request) {
    if (!user) return sendSuccessRes(null);

    await this.service.deleteMany([user.id]);

    return sendSuccessRes(null);
  }
}
