import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/admin/app/admin.service';
import { AuthService } from 'src/auth/auth.service';
import { QuestionService } from 'src/question/app/question.service';
import * as fs from 'fs';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly questionService: QuestionService,
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

  // @Timeout(2000)
  // async saveQuestion() {
  //   const questions = await this.questionService.findMany({
  //     order: { questionNumber: 'ASC' },
  //     select: {
  //       id: true,
  //       questionNumber: true,
  //       content: true,
  //       choiceA: true,
  //       choiceB: true,
  //       choiceC: true,
  //       choiceD: true,
  //       choiceE: true,
  //       choiceF: true,
  //       topic: true,
  //       answer: true,
  //       explanation2: true,
  //       explanation3: true,
  //       categoryId: true,
  //     },
  //   });

  //   const compactQuestions = questions.map((question) => {
  //     return {
  //       ...question,
  //       explanation: '',
  //     };
  //   });
  //   const json = JSON.stringify(compactQuestions, null, 2);
  //   fs.writeFileSync(
  //     process.cwd() + '/temp/questions_251221_compact.json',
  //     json,
  //   );
  //   this.logger.log('문제 저장 완료');
  // }

  // @Timeout(2000)
  // async saveQuestionRenew() {
  //   const json = fs.readFileSync(
  //     process.cwd() + '/data/questions_251221_renew.json',
  //     'utf8',
  //   );
  //   const questions = JSON.parse(json);
  //   for (const question of questions) {
  //     await this.questionService.update(
  //       { id: question.id },
  //       {
  //         explanation: question.explanation,
  //         explanation2: question.explanation2,
  //         topic: question.topic,
  //       },
  //     );
  //   }

  //   this.logger.log('문제 저장 완료');
  // }
}
