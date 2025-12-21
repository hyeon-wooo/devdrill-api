import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/admin/app/admin.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Timeout(1000)
  async createSuperAdminIfNotExists() {
    this.logger.log('Batch: 슈퍼관리자 계정 생성');
    const admin = await this.adminService.findOne({ level: 100 });
    if (admin) {
      this.logger.log('슈퍼관리자 이미 존재');
      return;
    }
    const name = '관리자';
    const email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn('SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD 환경변수 필요');
      return;
    }
    await this.adminService.create({
      name,
      email,
      password: this.authService.hashPassword(password),
      level: 100,
    });
    this.logger.log('슈퍼관리자 계정 생성 완료');
  }
}
