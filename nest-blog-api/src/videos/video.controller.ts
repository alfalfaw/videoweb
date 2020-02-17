import { Controller, Get, Post, Body, Param, Request, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'
import { Video } from './video.model'
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthGuard } from '@nestjs/passport';
import { Record } from 'src/records/record.model';
import { mongoose } from '@typegoose/typegoose';

// @prop({ required: true })
// title: string;
// @prop()
// desc?: string;
// @prop()
// author?: string;
// @prop()
// click_num: number;
// @prop()
// cover?: string;
// @prop()
// url?: string;
//   publish: boolean
//dto数据传输对象
class VideoDto {
    // 定义属性
    @ApiProperty({ example: '标题一', description: '视频标题' })
    @IsNotEmpty({ message: '请填写视频标题' })
    title: string
    @ApiProperty({ example: '描述', description: '视频描述' })
    desc?: string;
    @ApiProperty({ example: '点击', description: '视频点击' })
    click_num?: number;
    @ApiProperty({ example: '收藏', description: '视频收藏' })
    favorite_num?: number;

    @ApiProperty({ example: '作者', description: '视频作者' })
    author: string
    @ApiProperty({ example: 'jpg', description: '视频封面' })
    cover: string
    @ApiProperty({ example: 'video', description: '视频地址' })
    url: string
    @ApiProperty({ example: false, description: '是否发布' })
    publish: boolean
}


@Controller('videos')
@ApiTags('视频')
export class VideosController {
    constructor(
        @InjectModel(Video) private readonly videoModel: ModelType<Video>, @InjectModel(Record) private readonly recordModel: ModelType<Record>
    ) { }

    @Get()
    @ApiOperation({ summary: '显示视频列表' })
    async index(@Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string = '-_id', @Query('admin') admin: boolean = false, @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        if (typeof where === 'undefined') {
            where = {}
        }
        else {
            where = JSON.parse(where)
        }
        if (!admin) {
            where['publish'] = true
        }

        //符合条件的项目总数videoModel.estimatedDocumentCount()不带条件
        total = await this.videoModel.countDocuments(where)

        if (typeof limit === 'undefined') {
            data = await this.videoModel.find(where)
            return { total: total, data: data }
        }

        page_num = parseInt(page)
        limit_num = parseInt(limit)

        // let sum = await this.videoModel.estimatedDocumentCount()

        data = await this.videoModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })


        return { total: total, data: data }
    }
    //登陆用户显示红心
    @UseGuards(AuthGuard('jwt'))
    @Get('home')
    @ApiOperation({ summary: '显示用户视频列表' })
    async userhome(@Request() req, @Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string = '-_id', @Query('admin') admin: boolean = false, @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        if (typeof where === 'undefined') {
            where = {}
        }
        else {
            where = JSON.parse(where)
        }
        if (!admin) {
            where['publish'] = true
        }

        //符合条件的项目总数videoModel.estimatedDocumentCount()不带条件
        total = await this.videoModel.countDocuments(where)

        if (typeof limit === 'undefined') {
            data = await this.videoModel.find(where).lean().exec()
        }

        page_num = parseInt(page)
        limit_num = parseInt(limit)

        // let sum = await this.videoModel.estimatedDocumentCount()

        data = await this.videoModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort }).lean().exec()
        //{ video: 1 }只输出视频字段
        // const userFavorites = await this.recordModel.find({ user: req.user._id, type: 'favorite' }, { video: 1 })
        // global.console.log(userFavorites)
        let results = []
        // global.console.log(req.user)
        let userFav = await this.recordModel.find({ user: req.user._id, type: 'favorite' })
            .lean()
        let userFavorites = userFav.map(it => {
            return it.video
        })
        // global.console.log(userFavorites)
        //5e42c72a58643357c6e17ac5
        for (let video of data) {
            if (userFavorites.includes(video._id.toString())) {
                video['type'] = 'favorite'
            } else {
                video['type'] = 'undefined'
            }
            results.push(video)

        }
        // global.console.log(results)
        return { total: total, data: results }
    }

    @Post('create')
    @ApiOperation({ summary: '创建视频' })
    async create(@Body() createvideoDto: VideoDto) {
        // global.console.log(createvideoDto)
        await this.videoModel.create(createvideoDto);

        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '视频详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        await this.videoModel.findByIdAndUpdate(id, { $inc: { click_num: 1 } }, { new: true })
        return await this.videoModel.findById(id)
    }

    //用户是否收藏视频
    @UseGuards(AuthGuard('jwt'))
    @Get('favorite/:id')
    @ApiOperation({ summary: '收藏状态' })
    //获取参数
    async favorite(@Request() req, @Param('id') id: string) {
        const res = await this.recordModel.findOne({ user: req.user._id, video: id, type: 'favorite' }).lean()
        // global.console.log(res)
        return { favorite: res ? true : false }
    }


    @Put('update/:id')
    @ApiOperation({ summary: '修改视频' })
    async update(@Param('id') id: string, @Body() updatevideoDto: VideoDto) {
        await this.videoModel.findByIdAndUpdate(id, updatevideoDto)
        return {
            success: true
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除视频' })
    async remove(@Param('id') id: string) {
        await this.videoModel.findByIdAndDelete(id)
        return {
            success: true
        }
    }
    //点击较多的视频
    @Get('top')
    @ApiOperation({ summary: '点击较多' })
    //获取参数
    async top() {
        return await this.videoModel.find({ publish: true }, null, { limit: 5, sort: { click_num: -1 } })
    }

    //归档
    @Get('archive')
    @ApiOperation({ summary: '归档' })
    //获取参数
    async archive() {
        // const res = await this.videoModel.find({ publish: true }, null, { sort: '-createdAt' }).lean()
        // global.console.log('*************')
        // global.console.log(Math.floor(res[0].createdAt.getTime()/1000))
        // global.console.log
        const res = await this.videoModel.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    videos: { $push: { title: '$title', click_num: '$click_num', favorite_num: '$favorite_num' } },
                    // count: { $sum: 1 },
                }
            }
        ]);
        // global.console.log(res)
        return res

    }


    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '视频数据配置' })
    async option() {
        return {
            title: "视频管理",
            //解决avue自动添加属性  translate:false
            translate: false,
            column: [
                { prop: "title", label: "标题", sortable: true, search: true, regex: true, row: true },
                { prop: "desc", label: "描述", sortable: true, row: true },
                { prop: "click_num", label: "点击", sortable: true, row: true, value: 0 },
                { prop: "favorite_num", label: "收藏", sortable: true, row: true, value: 0 },
                { prop: "author", label: "作者", row: true },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "cover", label: "封面", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },
                { prop: "url", label: "视频地址", type: 'upload', listType: 'picture-img', row: true, action: 'upload', width: 120 },
                { prop: "publish", label: "是否发布", type: 'switch', row: true, displayAs: 'switch', value: false }

            ]
        }
    }

}
