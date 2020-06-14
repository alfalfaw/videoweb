import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Video } from 'src/videos/video.model';
import { User } from 'src/users/user.model';
import { Record } from './record.model';

@Module({
  imports: [TypegooseModule.forFeature([Record,User,Video])],
  controllers: [RecordsController]
})
export class RecordsModule {}
