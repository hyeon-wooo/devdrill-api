import {
  BadRequestException,
  ConflictException,
  Injectable,
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
    const alreadyUser = await this.findOne({ email });
    if (alreadyUser) throw new ConflictException('이미 존재하는 이메일입니다.');

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
    if (!user) throw new BadRequestException('일치하는 계정 정보가 없습니다.');

    const isPasswordValid = await this.authService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('일치하는 계정 정보가 없습니다.');

    const token = this.authService.generateToken(user.id, ERole.USR);

    return token;
  }
}
