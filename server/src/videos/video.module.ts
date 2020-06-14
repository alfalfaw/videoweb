import { Module } from '@nestjs/common';
import { VideosController } from './video.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Video } from './video.model';
import { Record } from 'src/records/record.model';


@Module({
  imports: [TypegooseModule.forFeature([Video,Record])],
  controllers: [VideosController]
})
export class VideosModule {}
