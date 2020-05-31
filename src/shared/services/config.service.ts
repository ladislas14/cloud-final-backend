import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';

export class ConfigService {
  constructor() {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `.env.${nodeEnv}`,
    });

    // Replace \\n with \n to support multiline strings in AWS
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(
        /\\n/g,
        '\n',
      );
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV');
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../entities/*.entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.get('POSTGRES_USERNAME'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DATABASE'),
      migrationsRun: true,
      synchronize: true,
      cache: true,
      logging: this.nodeEnv === 'development',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
