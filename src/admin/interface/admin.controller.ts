import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../app/admin.service';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { LoginBodyDto } from 'src/user/interface/user.dto';
import { Request, Response } from 'express';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from 'src/auth/auth.constant';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() { user }: Request) {
    if (!user) return sendFailRes('로그인 후 이용해주세요.');
    const found = await this.service.findOne({ id: user.id });
    if (!found) return sendFailRes('존재하지 않는 계정입니다.');

    return sendSuccessRes({
      me: {
        id: found.id,
        level: found.level,
        email: found.email,
      },
    });
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto, @Res() res: Response) {
    const result = await this.service.login(body);
    if (result === -1)
      return res.json(sendFailRes('일치하는 계정 정보가 없습니다.'));

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(ACCESS_COOKIE_NAME, result.accessToken, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: isProd ? 'none' : 'lax',
    });
    res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      sameSite: isProd ? 'none' : 'lax',
    });

    return res.json(sendSuccessRes(result));
  }

  // 로그아웃
  @Post('/logout')
  async logout(@Res() res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(ACCESS_COOKIE_NAME, {
      path: '/',
      sameSite: isProd ? 'none' : 'lax',
    });
    res.clearCookie(REFRESH_COOKIE_NAME, {
      path: '/',
      sameSite: isProd ? 'none' : 'lax',
    });
    return res.json(sendSuccessRes(true));
  }

  // 토큰 재발급
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      // 리프레시 토큰 쿠키에서 추출
      const refreshToken = req.cookies['rt'];
      if (!refreshToken)
        return res.json(
          sendFailRes('비정상적인 접근입니다.', 'NO_REFRESH_TOKEN'),
        );
      // 검증
      const payload = this.authService.verify(refreshToken);
      if (!payload) return res.json(sendFailRes('토큰이 만료되었습니다.'));

      // access/refresh 토큰 재발급
      const admin = await this.service.findOne({ id: payload.id });
      if (!admin)
        return res.json(sendFailRes('존재하지 않는 계정입니다.', 'NO_ACCOUNT'));
      const token = this.authService.generateAdminToken(admin);

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie(ACCESS_COOKIE_NAME, token.accessToken, {
        httpOnly: true,
        secure: isProd,
        path: '/',
        sameSite: isProd ? 'none' : 'lax',
      });
      res.cookie(REFRESH_COOKIE_NAME, token.refreshToken, {
        httpOnly: true,
        secure: isProd,
        path: '/',
        sameSite: isProd ? 'none' : 'lax',
      });
      return res.json(sendSuccessRes({ accessToken: token.accessToken }));
    } catch (e) {
      return res.json(sendFailRes('재발급 실패', 'REFRESH_FAIL'));
    }
  }
}
