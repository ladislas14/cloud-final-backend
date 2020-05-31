import { Global, HttpModule, Module } from '@nestjs/common';

import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { AwsS3Service } from './services/aws-s3.service';

const providers = [ConfigService, AwsS3Service, GeneratorService];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
