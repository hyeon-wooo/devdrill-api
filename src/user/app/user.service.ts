import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../infra/user.entity';
import { LoginBodyDto, SignupBodyDto } from '../interface/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ERole } from 'src/auth/role/role.enum';

@Injectable()
export class UserService extends CRUDService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    private readonly authService: AuthService,
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

  async login(body: LoginBodyDto) {
    const { email, password } = body;
    const user = await this.findOne({ email });
    if (!user) return -1;

    const isPasswordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) return -1;

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    const { password: _, ...me } = user;

    return {
      ...token,
      me,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.authService.decodeToken(refreshToken);
    if (!decoded) return -1;

    const user = await this.findOne({ id: decoded.id });
    if (!user) return -1;

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    return { accessToken: token.accessToken };
  }

  async refreshAllToken(refreshToken: string) {
    const decoded = this.authService.decodeToken(refreshToken);

    const user = await this.findOne({ id: decoded.id });
    if (!user)
      throw new UnauthorizedException('인증 정보가 올바르지 않습니다.');

    const token = this.authService.generateToken(
      user.id,
      ERole.USR,
      user.level,
    );

    const { password: _, ...me } = user;

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      me,
    };
  }
}
