import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express"
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
//
import multer = require('multer');
@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly authService: AuthService) { }

  //无需jwt就能访问
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @ApiOperation({ summary: '登陆' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  //需要用jwt才能访问的api,用 @UseGuards(AuthGuard('jwt'))标注
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: '获取用户资料' })
  getProfile(@Request() req) {
    return req.user;
  }


  //使用拦截器file是数据名
  // @UseGuards(AuthGuard('jwt'))

  // @UseInterceptors(FileInterceptor('file', {
  //   storage: multer.diskStorage({
  //     destination: (req, file, cb) => {
  //       cb(null, 'uploads');
  //     },
  //     filename: (req, file, cb) => {
  //       cb(null, Date.now() + file.originalname);
  //     },
  //   }),
  // }))
  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile('file') file) {
    //返回对象
    return { url: `http://localhost:5000/uploads/${file.filename}` }
  }
  //上传多个文件
  @Post('uploadmany')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  uploadmany(@UploadedFiles() files) {
    let cover = null
    let url = null
    const base_url = 'http://localhost:5000/uploads/'
    let image = files['image'][0]
    let video = files['video'][0]
    // let index1 = image.mimetype.lastIndexOf("\/")
    // let index2 = video.mimetype.lastIndexOf("\/")
    //+ '.' + image.mimetype.substring(index1 + 1, image.mimetype.length)
    //+ '.' + video.mimetype.substring(index2 + 1, video.mimetype.length)
    cover = base_url + image.filename
    url = base_url + video.filename
    return { cover: cover, url: url }
  }




}
