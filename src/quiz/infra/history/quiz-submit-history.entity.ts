import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'quiz_history_submit', comment: '문제풀이 제출 내역' })
export class QuizSubmitHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '퀴즈 ID (quiz.id)' })
  quizId: number;

  @Column('int', { comment: '사용자 ID (user.id)' })
  userId: number;

  @Column('varchar', {
    comment: '선택한 보기 (잘모르겠어요 선택 시 null)',
    nullable: true,
  })
  choicedAnswer: string | null;

  @Column('boolean', { comment: '정답 여부' })
  isCorrect: boolean;

  @Column('int', { comment: '소요 시간(초). 앱에서 계산해서 전달' })
  takenSeconds: number;
}
