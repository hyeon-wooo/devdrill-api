import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { AdminEntity } from '../infra/admin.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginBodyDto } from 'src/user/interface/user.dto';

@Injectable()
export class AdminService extends CRUDService<AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity) repo: Repository<AdminEntity>,
    private authService: AuthService,
  ) {
    super(repo);
  }

  async login(body: LoginBodyDto) {
    const { email, password } = body;
    const admin = await this.findOne({ email });
    if (!admin) return -1;

    const isPasswordValid = await this.authService.comparePassword(
      password,
      admin.password,
    );
    if (!isPasswordValid) return -1;

    const token = this.authService.generateAdminToken(admin);

    const { password: _, ...me } = admin;

    return {
      ...token,
      me,
    };
  }
}
