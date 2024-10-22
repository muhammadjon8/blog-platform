import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBlogDto{
    @IsString()
    title: string;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    content: string;

    @IsNumber()
    author: number;
}