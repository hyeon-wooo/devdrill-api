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
          maxRetriesPerRequest: 0,
          commandTimeout: 1000,
          retryStrategy: (times) => {
            // 지수 백오프. 최대 1분. 100ms * 2^(n-1). 100ms, 200ms, 400ms, 800ms, 1600ms, 3200ms, 6400ms, 12800ms, 25600ms, 51200ms, 이후 60000ms
            const delay = Math.min(100 * 2 ** (times - 1), 60000);

            logger.warn(
              `Redis connection lost. Retry attempt #${times} in ${delay}ms...`,
            );
            return delay;
          },
        });

        redis.on('error', (err) =>
          logger.error('Redis Client Error: ' + err.message + err.stack),
        );
        redis.on('ready', () =>
          logger.log('Redis Client Ready (Auth Success)'),
        );
        redis.on('close', () => logger.log('Redis Client Disconnected'));
        redis.on('connect', () => logger.log('Redis Client Connected'));

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
