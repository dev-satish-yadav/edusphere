import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TenantLoginDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
