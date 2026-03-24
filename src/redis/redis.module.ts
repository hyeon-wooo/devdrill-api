import { Global, Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

import { REDIS_CLIENT_TOKEN } from './redis.constant';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT_TOKEN,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('RedisClient');
        const redis = new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USER'),
          password: configService.get<string>('REDIS_PW'),
          // 첫 명령 시까지 연결 지연 (부팅 방지 핵심)
          lazyConnect: true,
          // 자동 재연결 전략: FIXME: 재연결 전략 꼼꼼히 다시 짜야함
          retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        redis.on('error', (err) =>
          logger.error('Redis Client Error: ' + err.message),
        );
        redis.on('connect', () => logger.log('Redis Client Connected'));
        redis.on('close', () => logger.log('Redis Client Disconnected'));

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT_TOKEN, RedisService],
})
export class RedisModule {}
