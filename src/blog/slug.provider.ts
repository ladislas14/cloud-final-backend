import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugProvider {
  slugify(slug: string): string {
    return slugify(slug, {
      replacement: '-',
      lower: true,
    });
  }

  replacement(): string {
    return '-';
  }
}
