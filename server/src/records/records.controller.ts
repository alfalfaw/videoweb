import { Controller, Get, Query, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, Ref } from '@typegoose/typegoose/lib/types';
import { AuthGuard } from '@nestjs/passport';
import { Video } from 'src/videos/video.model';
import { User } from 'src/users/user.model';
import { Record } from './record.model';
import { mongoose } from '@typegoose/typegoose';


class RecordDto {
    @ApiProperty({ example: 'history', description: '类型' })
    type: string
    @ApiProperty({ example: '123', description: '视频id' })
    video: Ref<Video>;
    @ApiProperty({ example: '12334', description: '用户id' })
    user: Ref<User>;

}
@Controller('records')
@ApiTags('Records')
export class RecordsController {
    constructor(@InjectModel(Record) private readonly recordModel: ModelType<Record>, @InjectModel(User) private readonly userModel: ModelType<User>, @InjectModel(Video) private readonly videoModel: ModelType<Video>) { }

    @Get()
    @ApiOperation({ summary: '记录列表' })
    async index(@Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string = '-_id', @Query('where') where) {
        let page_num = null
        let limit_num = null
        let total = null
        let data = null

        //符合条件数量
        if (typeof where === 'undefined') {
            where = {}
        }
        else {
            where = JSON.parse(where)
        }
        total = await this.recordModel.countDocuments(where)
        // global.console.log('tags count   '+total)

        if (typeof limit === 'undefined') {
            data = await this.recordModel.find()
            return { total: total, data: data }
        }
        //分页查询
        page_num = parseInt(page)
        // global.console.log(page_num)
        limit_num = parseInt(limit)

        data = await this.recordModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })

        return { total: total, data: data }

    }

    @Post('create')
    @ApiOperation({ summary: '创建记录' })
    async create(@Body() createRecordDto: RecordDto) {

        await this.recordModel.create(createRecordDto)

        // global.console.log(createRecordDto)
        return {
            success: true
        }
    }

    @Get('detail/:id')
    @ApiOperation({ summary: '记录详情' })
    //获取参数
    async detail(@Param('id') id: string) {
        return await this.recordModel.findById(id)
    }

    @Put('update/:id')
    @ApiOperation({ summary: '修改记录' })
    async update(@Param('id') id: string, @Body() updateRecordDto: RecordDto) {
        await this.recordModel.findByIdAndUpdate(id, updateRecordDto)
        return { success: true }
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: '删除记录' })
    async remove(@Param('id') id: string) {
        await this.recordModel.findByIdAndDelete(id)
        return { success: true }
    }
    // 记录行为
    // 记录浏览历史
    @UseGuards(AuthGuard('jwt'))
    @Get('collection/:resource')
    @ApiOperation({ summary: '用户浏览历史或收藏夹' })
    async history(@Request() req, @Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string = '-_id', @Query('where') where, @Param('resource') resource: string) {
        // global.console.log(req.user)
        let page_num = null
        let limit_num = null
        let total = null
        let data = null
        // global.console.log(req.user)

        // //符合条件数量
        if (typeof where === 'undefined') {
            where = {}
        }
        else {
            where = JSON.parse(where)
        }
        //筛选用户
        where['user'] = req.user._id

        //筛选类型
        where['type'] = resource

        // global.console.log(where)
        //符合条件总数
        //不必去重，真实数据没有重复
        total = await this.recordModel.countDocuments(where)

        // global.console.log(total)
        //不分页
        if (typeof limit === 'undefined') {
            data = await this.recordModel.find(where)
        } else {
            //分页查询
            page_num = parseInt(page)
            // global.console.log(page_num)
            limit_num = parseInt(limit)

            data = await this.recordModel.find(where, null, { skip: (page_num - 1) * limit_num, limit: limit_num, sort: sort })

        }
        let results = []
        const video_list = data.map(item => {
            // return item['video']
            return mongoose.Types.ObjectId(item['video'])
        })
        if (resource == 'history') {
            let favs = await this.recordModel.find({ user: req.user._id, type: 'favorite' }, { video: 1, _id: 0 }).lean()
            favs = favs.map(it => {
                return it['video'].toString()
            })
            // global.console.log(favs)
            for (let video of video_list) {
                const res = await this.videoModel.findById(video).lean()
                if (favs.includes(video.toString())) {
                    res['type'] = "favorite"
                } else {
                    res['type'] = "history"
                }
                results.push(res)
            }

        } else {
            for (let video of video_list) {
                const res = await this.videoModel.findById(video).lean()
                res['type'] = "favorite"
                results.push(res)
            }
        }

        // for (let item of list) {
        //     const res = await this.videoModel.findById(item.id).lean()

        //     res['type'] = item.type
        //     results.push(res)

        // }
        // results = Promise.all(list.map(async it => {
        //     //.lean().exec()生成js对象
        //     let doc = await this.videoModel.findById(it.id).lean().exec()
        //     doc['type'] = it.type
        //     // global.console.log(doc)
        //     return doc
        // }))
        // global.console.log(results)
        return { total: total, data: results }

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('favorite')
    @ApiOperation({ summary: '收藏' })
    async userLike(@Request() req, @Query('video') video: string, @Query('like') like: string) {
        // global.console.log(req.user._id)
        // global.console.log(video)
        if (like == 'false') {
            //收藏减1
            await this.videoModel.findByIdAndUpdate(video, { $inc: { favorite_num: -1 } })
            await this.recordModel.findOneAndDelete({ user: req.user._id, video: video, type: 'favorite' })

        } else {
            //收藏加1
            await this.videoModel.findByIdAndUpdate(video, { $inc: { favorite_num: 1 } })
            await this.recordModel.create({ user: req.user._id, video: video, type: 'favorite' })
            await this.recordModel.findOneAndUpdate({ user: req.user._id, video: video, type: 'history' }, { $set: { user: req.user._id, video: video, type: 'history', updatedAt: Date.now() } }, { upsert: true })
        }
        // global.console.log(tmp)

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('history')
    @ApiOperation({ summary: '浏览' })
    async userHistory(@Request() req, @Query('video') video: string) {
        await this.recordModel.findOneAndUpdate({ user: req.user._id, video: video, type: 'history' }, { $set: { user: req.user._id, video: video, type: 'history', updatedAt: Date.now() } }, { upsert: true })
        // await this.recordModel.create({ user: req.user._id, video: video, type: 'history' })
    }



    //从服务端获取avue option
    @Get('option')
    @ApiOperation({ summary: '记录数据配置' })
    async option() {
        const users = (await this.userModel.find()).map(v => ({
            label: v.username,
            value: v._id
        }))
        const videos = (await this.videoModel.find()).map(v => ({
            label: v.title,
            value: v._id
        }))

        return {
            title: "记录管理",
            translate: false,
            column: [
                { prop: "type", label: "记录类型", row: true, type: 'select', dicData: [{ label: '历史', value: 'history' }, { label: '收藏', value: 'favorite' }] },
                { prop: "user", label: "用户", row: true, type: 'select', dicData: users },
                { prop: "video", label: "视频", row: true, type: 'select', dicData: videos },
                { prop: "createdAt", label: "创建时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" },
                { prop: "updatedAt", label: "更新时间", editDisplay: false, addDisplay: false, sortable: true, type: "date", format: "yyyy-MM-dd hh:mm" }
            ]
        }
    }


}
