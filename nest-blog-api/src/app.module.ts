import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/video.module';
import { TypegooseModule } from 'nestjs-typegoose'

import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecordsModule } from './records/records.module';


//ali-oss
// const MAO = require('multer-aliyun-oss');

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27017/nest-blog-api", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    //设置上传地址
    MulterModule.register({
      // storage: MAO({
      //   config: {
      //     region: 'oss-cn-shanghai',
      //     accessKeyId: 'LTAI4Ff7HPW1jNjhJDUdj4nR',
      //     accessKeySecret: 'qydIOq3fkvbbK7vQuHTaM8htgjtSXc',
      //     bucket: 'alfalfaw'
      //   }
      // })
      dest: 'uploads'
    }),

    VideosModule,

    AuthModule,

    UsersModule,

    RecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
