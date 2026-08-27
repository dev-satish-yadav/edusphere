import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class DeleteErrorLogDto {
  @ApiProperty({ type: [String], example: ['652f1c9a1a2b3c4d5e6f7a8b'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  ids: string[];
}
