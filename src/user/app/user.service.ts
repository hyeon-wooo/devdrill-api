import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { UserEntity } from '../infra/user.entity';
import { LoginBodyDto, SignupBodyDto } from '../interface/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ERole } from 'src/auth/role/role.enum';
import { TokenHistoryService } from './token-history.service';

@Injectable()
export class UserService extends CRUDService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly tokenHistoryService: TokenHistoryService,
  ) {
    super(repo);
  }

  async signup(body: SignupBodyDto) {
    const { name, email, password } = body;
    const alreadyEmailUser = await this.findOne({ email });
    if (alreadyEmailUser) return -1;

    const alreadyNameUser = await this.findOne({ name });
    if (alreadyNameUser) return -2;

    const hashedPassword = await this.authService.hashPassword(password);
    const createdUser = await this.create({
      name,
      email,
      password: hashedPassword,
    });
    return createdUser;
  }

  async login(body: LoginBodyDto, ip: string) {
    const { email, password } = body;
    const user = await this.findOne({ email });
    if (!user) return -1;

    const isPasswordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) return -1;

    await this.flushRefreshTokenByUserId(user.id);

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    await this.tokenHistoryService.create({
      userId: user.id,
      refreshToken: token.refreshToken,
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일
      issuedIp: ip,
      issuedDeviceId: body.deviceId,
    });

    const { password: _, ...me } = user;

    return {
      ...token,
      me,
    };
  }

  async refreshAccessToken(refreshToken: string, ip: string) {
    const decoded = this.authService.decodeToken(refreshToken);
    if (!decoded) return -1;

    const tokenHistory = await this.tokenHistoryService.findOne({
      refreshToken,
      expiredAt: MoreThan(new Date()),
    });
    if (!tokenHistory) return -2;

    const user = await this.findOne({ id: decoded.id });
    if (!user) return -1;

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    return { accessToken: token.accessToken };
  }

  async renewRefreshToken(refreshToken: string, ip: string, deviceId: string) {
    const decoded = this.authService.decodeToken(refreshToken);
    if (!decoded) return -1;

    const user = await this.findOne({ id: decoded.id });
    if (!user) return -1;

    const tokenHistory = await this.tokenHistoryService.findOne({
      userId: user.id,
      issuedDeviceId: deviceId,
    });
    if (!tokenHistory) return -1;

    await this.flushRefreshTokenByUserId(user.id);

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    await this.tokenHistoryService.create({
      userId: user.id,
      refreshToken: token.refreshToken,
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일
      issuedIp: ip,
      issuedDeviceId: deviceId,
    });

    const { password: _, ...me } = user;

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      me,
    };
  }

  // 기존 발급된 리프레시토큰 삭제
  async flushRefreshTokenByUserId(userId: number) {
    await this.tokenHistoryService.deleteWithWhere({
      userId,
      deletedAt: IsNull(),
    });

    return true;
  }
}
