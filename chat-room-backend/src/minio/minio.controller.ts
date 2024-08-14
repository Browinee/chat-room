import { Controller, Get, Inject, Query } from '@nestjs/common';
import * as Minio from 'minio';

const MINIO_BUCKET = 'avatar';
@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  @Get('presignedUrl')
  async presignedPutObject(@Query('name') name: string) {
    const obj = await this.minioClient.presignedPutObject(
      MINIO_BUCKET,
      name,
      3600,
    );
    console.log('obj', obj);
    return obj;
  }
}
