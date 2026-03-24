import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT_TOKEN } from './redis.constant';
import Redis from 'ioredis';
import { CommandEntity } from 'src/command/infra/entity/command.entity';

type TCommandCache = CommandEntity & { expiry: number; gap: number };

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT_TOKEN) private readonly redis: Redis) {}

  async getCommandCache(
    commandId: number,
  ): Promise<{ command: TCommandCache | null; needUpdate: boolean }> {
    const cached = await this.redis.call('GET', `cmd:${commandId}`);
    const command = cached
      ? (JSON.parse(cached as string) as TCommandCache)
      : null;
    if (!command)
      return {
        command,
        needUpdate: true,
      };

    // PER (Probabilistic Early Recomputation)
    const remain = command.expiry - Date.now() / 1000;
    const needUpdate = this.per(remain, command.ttl, command.gap);
    return {
      command,
      needUpdate,
    };
  }

  async setCommandCache(command: CommandEntity, gap: number) {
    const expiry = command.ttl + Math.floor(Date.now() / 1000);
    const cache = {
      ...command,
      expiry,
      gap: gap / 1000,
    };

    // res: "OK"
    const result = await this.redis.call(
      'SET',
      `cmd:${command.id}`,
      JSON.stringify(cache),
      'EX',
      command.ttl,
    );

    return result === 'OK';
  }

  // 기존 per 알고리즘은 트래픽이 무지 많을 때나 실효성이 있을 듯 (remain과 비교할 값이 0.xx ~ 1.xx 사이로 나옴.)
  // 다음 조건으로 개선
  // (ttl - remain - gap*5 / ttl) = 지나간 시간 비율(0~1). 지나간 시간에는 db에서 다시 조회해오는 시간을 포함시키며, db 부하 상태에 따라 마지막 gap에 비해 최대 5배까지 소요될 수 있다고 가정 (5 = 보수적 값).
  // random < 지나간 시간 비율 : 갱신 당첨
  per(remain: number, ttl: number, gap: number): boolean {
    const elapsedRatio = (ttl - remain - gap * 5) / ttl;
    if (elapsedRatio < 0.5) return false; // ttl이 반 이상 지나지 않았다면 무조건 갱신 X.

    return Math.random() < elapsedRatio;
  }
}
