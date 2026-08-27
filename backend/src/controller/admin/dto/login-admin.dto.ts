import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ example: 'root@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret1234' })
  @IsString()
  @MaxLength(72)
  password: string;
}
