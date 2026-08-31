import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Root' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: 'root@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret1234', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt ignores bytes past 72
  password: string;

  @ApiPropertyOptional({ enum: ['admin', 'superadmin'], default: 'admin' })
  @IsOptional()
  @IsIn(['admin', 'superadmin'])
  role?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2000' })
  @IsString()
  @IsOptional()
  secretCode?: string;
}
