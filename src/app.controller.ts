import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { sendFailRes, sendSuccessRes } from './common/generateResponse';
import { UserService } from './user/app/user.service';
import { AuthService } from './auth/auth.service';
import { UserEntity } from './user/infra/user.entity';
import { EDeviceOS } from './user/interface/user.dto';
import { ClientIp } from './common/client-ip.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
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
      adEnv: 'dev',
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
}
