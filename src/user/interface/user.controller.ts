import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../app/user.service';
import { LoginBodyDto, RegisterFcmBodyDto, SignupBodyDto } from './user.dto';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { FcmHistoryService } from '../app/fcm-history.service';
import { ClientIp } from 'src/common/client-ip.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly fcmHistoryService: FcmHistoryService,
  ) {}

  @Post('/signup')
  async signup(@Body() body: SignupBodyDto) {
    const result = await this.service.signup(body);
    if (result === -1) return sendFailRes('이미 가입된 이메일입니다.');
    if (result === -2) return sendFailRes('이미 가입된 이름입니다.');

    return sendSuccessRes(null);
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto, @ClientIp() ip: string) {
    const result = await this.service.login(body, ip);
    if (result === -1) return sendFailRes('일치하는 계정 정보가 없습니다.');

    return sendSuccessRes(result);
  }

  @Post('/refresh-access-token')
  async refreshAccessToken(
    @Body() body: { refreshToken: string; deviceId: string },
    @ClientIp() ip: string,
  ) {
    const result = await this.service.renewRefreshToken(
      body.refreshToken,
      ip,
      body.deviceId,
    );
    return sendSuccessRes(result);
  }

  @Post('/fcm')
  @UseGuards(JwtAuthGuard)
  async registerFcm(
    @Body() body: RegisterFcmBodyDto,
    @Req() { user }: Request,
  ) {
    if (!user) return sendFailRes('인증 정보가 올바르지 않습니다.');

    // 이전 FCM 토큰 삭제 및 강제로그아웃
    const existingFcmHistory = await this.fcmHistoryService.findMany({
      where: {
        userId: user.id,
      },
    });

    const existingHistoryIds = existingFcmHistory.map(
      (fcmHistory) => fcmHistory.id,
    );
    await this.fcmHistoryService.deleteMany(existingHistoryIds);

    const existingFcms = existingFcmHistory.map((fcmHistory) => fcmHistory.fcm);
    // TODO: 강제로그아웃 푸시알림 발송

    await this.fcmHistoryService.create({
      userId: user.id,
      fcm: body.fcm,
      deviceId: body.deviceId,
      deviceModel: body.deviceModel,
      deviceOsVersion: body.deviceOsVersion,
      deviceOs: body.deviceOs,
      appVersion: body.appVersion,
    });

    await this.service.update({ id: user.id }, { fcm: body.fcm });

    return sendSuccessRes(null);
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
