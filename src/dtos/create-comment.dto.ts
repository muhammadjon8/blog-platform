import { IsNumber, IsString } from "class-validator";

export class CreateCommentDto{
    @IsString()
    content: string;

    @IsNumber()
    blogId: number;

}