import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/services/config.service';

@Module({
  imports: [
    BlogModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) =>
        configService.typeOrmConfig,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
