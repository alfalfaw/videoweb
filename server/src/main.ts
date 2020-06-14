import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
async function bootstrap() {
  //云端
  // const fs = require('fs');
  // const keyFile = fs.readFileSync('/etc/letsencrypt/live/alfalfa.website/privkey.pem');
  // const certFile = fs.readFileSync('/etc/letsencrypt/live/alfalfa.website/fullchain.pem');
  // //指定app类型
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   httpsOptions: {
  //     key: keyFile,
  //     cert: certFile,
  //   }
  // });
  //云端
  //本地运行
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  //本地运行
  app.useStaticAssets('uploads', {
    //访问前缀
    prefix: '/uploads'
  })
  // app.use(bodyParser.json({ limit: '1000mb' }))
  // app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }))
  app.useStaticAssets('public')
  //开启全局验证
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  const options = new DocumentBuilder()
    .setTitle('视频网站API')
    .setDescription('The video website API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)
  await app.listen(5000)
  // 运行端口
}
bootstrap()
