import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { sendFailRes, sendSuccessRes } from './common/generateResponse';
import { UserService } from './user/app/user.service';
import { AuthService } from './auth/auth.service';
import { UserEntity } from './user/infra/user.entity';
import { EDeviceOS } from './user/interface/user.dto';
import { ClientIp } from './common/client-ip.decorator';
import { ConfigService } from '@nestjs/config';
import { ExamService } from './exam/app/exam.service';
import { PracticeService } from './practice/app/practice.service';
import { JwtAuthGuard, JwtPassGuard } from './auth/jwt.guard';
import { Request } from 'express';
import { LogService } from './log/app/log.service';
import { SessionId } from './log/app/session-id.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly examService: ExamService,
    private readonly practiceService: PracticeService,
    private readonly logService: LogService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/launch')
  @UseGuards(JwtPassGuard)
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
    @SessionId() sessionId: string,
  ) {

    if (!sessionId) return sendFailRes('세션 ID가 없습니다.');

    const launchLogPayload: {
      sessionId: string;
      launchAt: Date;
      deviceId: string;
      deviceModel: string;
      deviceOsVersion: string;
      deviceOs: EDeviceOS;
      appVersion: string;
      ip: string;
      userId: number | null;
      initialUserId: number | null;
    } = {
      sessionId,
      launchAt: new Date(),
      deviceId: body.deviceId,
      deviceModel: body.deviceModel,
      deviceOsVersion: body.deviceOsVersion,
      deviceOs: body.deviceOs,
      appVersion: body.appVersion,
      ip,
      userId: null,
      initialUserId: null
    }

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
        launchLogPayload.userId = result.me.id;
        launchLogPayload.initialUserId = result.me.id;

        // 마지막 접속 일시 업데이트
        this.userService.update({ id: result.me.id }, { lastAccessAt: new Date() });
      }
    }

    this.logService.createLaunchLog(launchLogPayload);

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
