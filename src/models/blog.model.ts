import { IsString } from 'class-validator';

export class BlogModel {
  readonly id: number;

  slug: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  publishAt?: Date;

  published?: boolean;

  photoId?: string;
}
