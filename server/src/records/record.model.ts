import { prop, modelOptions, Ref } from "@typegoose/typegoose";
import { Video } from "src/videos/video.model";
import { User } from "src/users/user.model";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    }
})
export class Record {
    @prop()
    type?: string;
    @prop()
    video?: Ref<Video>;
    @prop()
    user?: Ref<User>;

}