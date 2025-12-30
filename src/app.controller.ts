import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { sendFailRes, sendSuccessRes } from './common/generateResponse';
import { UserService } from './user/app/user.service';
import { AuthService } from './auth/auth.service';
import { UserEntity } from './user/infra/user.entity';
import { EDeviceOS } from './user/interface/user.dto';
import { ClientIp } from './common/client-ip.decorator';
import { ConfigService } from '@nestjs/config';
import { ExamService } from './exam/exam.service';
import { PracticeService } from './practice/application/practice.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly examService: ExamService,
    private readonly practiceService: PracticeService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/launch')
  async launch(
    @Body()
    body: {
      refreshToken?: string;
      deviceId: string;
      deviceModel: string;
      deviceOsVersion: string;
      deviceOs: EDeviceOS;
      appVersion: string;
    },
    @ClientIp() ip: string,
  ) {
    const res: {
      accessToken?: string;
      refreshToken?: string;
      me?: UserEntity;
      needUpdate: boolean;
      storeUrlIos: string;
      storeUrlAndroid: string;
      adEnv: 'dev' | 'prod';
    } = {
      needUpdate: false,
      storeUrlIos: 'https://apps.apple.com/app/id6756648110',
      storeUrlAndroid:
        'https://play.google.com/store/apps/details?id=com.the9thstation.devdrill',
      adEnv:
        this.configService.get('NODE_ENV') === 'production' ? 'prod' : 'dev',
    };

    if (body.refreshToken) {
      const result = await this.userService.renewRefreshToken(
        body.refreshToken,
        ip,
        body.deviceId,
      );

      if (result !== -1 && result !== -2) {
        res.accessToken = result.accessToken;
        res.refreshToken = result.refreshToken;
        res.me = result.me as UserEntity;
      }
    }

    // TODO: 버전 검사

    return sendSuccessRes(res);
  }

  @Get('/home')
  @UseGuards(JwtAuthGuard)
  async getHomeData(@Req() { user }: Request) {
    if (!user) return sendFailRes('비정상적인 접근입니다.');
    const userId = user.id;

    const inProgressPractice =
      await this.practiceService.getInProgressPractice(userId);

    const examList = await this.examService.getExamList(
      userId,
      user.canReadAll,
    );

    return sendSuccessRes({
      inProgressPractice: inProgressPractice
        ? {
            id: inProgressPractice.id,
            examName: `${inProgressPractice.exam.name} ${inProgressPractice.exam.subName}`,
          }
        : null,
      examList,
    });
  }
}
