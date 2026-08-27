import { IsEnum, IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { InstitutionType } from '../entities/institution.entity';

export class CreateInstitutionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(InstitutionType)
  type: InstitutionType;

  @IsNotEmpty()
  @IsString()
  adminName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
