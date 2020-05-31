import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';

import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';
import { IAwsfileSignedUrl } from 'src/interfaces/IAwsfileSignedUrl.interface';

@Injectable()
export class AwsS3Service {
  private readonly _s3: AWS.S3;

  constructor(
    public configService: ConfigService,
    public generatorService: GeneratorService,
  ) {
    const options: AWS.S3.Types.ClientConfiguration = {
      apiVersion: '2010-12-01',
      region: 'ap-southeast-1',
    };

    const awsS3Config = configService.awsS3Config;
    if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
      options.credentials = awsS3Config;
    }

    this._s3 = new AWS.S3(options);
  }

  async getSignedUrl(photo: IAwsfileSignedUrl) {
    const fileName = this.generatorService.fileName(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      <string>mime.extension(photo.contentType),
    );
    const key = fileName;
    const params = {
      Bucket: this.configService.awsS3Config.bucketName,
      Key: key,
      Expires: 3600,
      ContentType: photo.contentType,
      ACL: 'public-read',
    };
    const s3Url = await this._s3.getSignedUrlPromise(
      'putObject',
      params,
    );
    return {
      fileName,
      s3Url,
    };
  }
}
