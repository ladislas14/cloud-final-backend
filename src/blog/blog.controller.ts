import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Request,
  NotFoundException,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  UseGuards,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { Pagination } from './../paginate';
import { BlogService } from './blog.service';
import { BlogModel } from '../models/blog.model';
import { UpdateResult, DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IAwsfileSignedUrl } from 'src/interfaces/IAwsfileSignedUrl.interface';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async index(@Request() request): Promise<Pagination<BlogEntity>> {
    return await this.blogService.paginate({
      limit: request.query.hasOwnProperty('limit')
        ? request.query.limit
        : 10,
      page: request.query.hasOwnProperty('page')
        ? request.query.page
        : 0,
    });
  }

  @Get('/:slug')
  async show(@Param('slug') slug: string): Promise<BlogEntity> {
    const blog = await this.blogService.findBySlug(slug);

    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) body: BlogModel,
  ): Promise<BlogEntity> {
    const exists = await this.blogService.findBySlug(body.slug);

    if (exists) {
      throw new UnprocessableEntityException();
    }

    return await this.blogService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: BlogModel,
  ): Promise<UpdateResult> {
    const blog = await this.blogService.findById(body.id);

    if (!blog) {
      throw new NotFoundException();
    }

    return await this.blogService.update({
      ...blog,
      ...body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    console.log('called');
    const blog = await this.blogService.findById(id);

    if (!blog) {
      throw new NotFoundException();
    }

    return await this.blogService.destroy(blog.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@Body() photo: IAwsfileSignedUrl) {
    const photoId = await this.blogService.uploadPhoto(photo);

    return {
      message: 'the photo has been uploaded',
      data: { photoId },
    };
  }
}
