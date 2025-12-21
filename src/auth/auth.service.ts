import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ERole } from './role/role.enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/user/infra/user.entity';
import { AdminEntity } from 'src/admin/infra/admin.entity';

@Injectable()
export class AuthService {
  private salt: number;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.salt = Number(this.configService.get('BCRYPT_SALT'));
  }

  verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  generateToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          role: ERole.USR,
          level: user.level,
          canSkipAd: user.canSkipAd,
          canReadAll: user.canReadAll,
        },
        { expiresIn: '1m' },
      ),
      refreshToken: this.jwtService.sign(
        {
          id: user.id,
          role: ERole.USR,
          level: user.level,
        },
        { expiresIn: '30d' },
      ),
    };
  }

  generateAdminToken(admin: AdminEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: admin.id,
          role: ERole.ADM,
          level: admin.level,
        },
        { expiresIn: '1m' },
      ),
      refreshToken: this.jwtService.sign(
        {
          id: admin.id,
          role: ERole.ADM,
          level: admin.level,
        },
        { expiresIn: '30d' },
      ),
    };
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, this.salt);
  }

  comparePassword(input: string, hashed: string) {
    return bcrypt.compareSync(input, hashed);
  }
}
