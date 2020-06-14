import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads');
      },
      filename: (req, file, cb) => {
        cb(null, (new Date()).getTime() + file.originalname.replace(/\s+/g, ""));
      },
    }),
  }))
  async upload(@UploadedFile('file') file) {
    //返回对象
    // return file
    return { url: `http://localhost:5000/uploads/${file.filename}` }

  }

  // @Post('upload')
  // @ApiOperation({ summary: '上传文件' })
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile('file') file) {
  //   //返回对象
  //   return { url: `https://alfalfa.website:5000/uploads/${file.filename}` }
  // }

  //上传多个文件
  @Post('uploadmany')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ], {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads');
      },
      filename: (req, file, cb) => {
        cb(null, (new Date()).getTime() + file.originalname.replace(/\s+/g, ""));
      },
    }),
  }))
  uploadmany(@UploadedFiles() files) {
    let cover = null
    let url = null
    const base_url = 'http://localhost:5000/uploads/'
    let image = null
    let video = null
    if (files.image) {
      image = files['image'][0]
      cover = base_url + image.filename
    }
    if (files.video) {
      video = files['video'][0]
      url = base_url + video.filename
    }

    return { cover: cover, url: url, success: true }
  }
  // @Post('uploadmany')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'image', maxCount: 1 },
  //   { name: 'video', maxCount: 1 },
  // ]))
  // uploadmany(@UploadedFiles() files) {
  //   let cover = null
  //   let url = null
  //   const base_url = 'https://alfalfa.website:5000/uploads/'
  //   let image = null
  //   let video = null
  //   if (files.image) {
  //     image = files['image'][0]
  //     cover = base_url + image.filename
  //   }
  //   if (files.video) {
  //     video = files['video'][0]
  //     url = base_url + video.filename
  //   }

  //   return { cover: cover, url: url, success: true }
  // }




}
