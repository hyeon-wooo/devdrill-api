import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      host: this.configService.get('DB_HOST'),
      database: this.configService.get('DB_NAME'),
      port: this.configService.get('DB_PORT'),
      synchronize: true,
      entities: ['dist/**/*.entity.js'],
    };
  }
}
