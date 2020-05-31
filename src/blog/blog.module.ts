import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { BlogService } from './blog.service';
import { ConfigModule } from 'nestjs-config';
import { BlogController } from './blog.controller';
import { SlugProvider } from './slug.provider';
import { AwsS3Service } from 'src/shared/services/aws-s3.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([BlogEntity]),
    AwsS3Service,
  ],
  controllers: [BlogController],
  providers: [SlugProvider, BlogService],
})
export class BlogModule {}
