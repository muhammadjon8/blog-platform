import { IsEmail, IsString, MinLength } from 'class-validator'

export class UpdateUserProfile {
  @IsString()
  name: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}
