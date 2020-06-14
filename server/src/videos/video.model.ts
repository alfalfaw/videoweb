import { prop, modelOptions } from '@typegoose/typegoose';


@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
})
export class Video {
  @prop({ required: true })
  title: string;
  @prop()
  desc?: string;
  @prop()
  author?: string;
  @prop()
  click_num?: number;
  @prop()
  favorite_num?: number;
  @prop()
  cover?: string;
  @prop()
  url?: string;
  @prop({ required: true })
  publish: boolean


}