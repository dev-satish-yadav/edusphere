import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { Institution, InstitutionSchema } from './entities/institution.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Institution.name, schema: InstitutionSchema }]),
  ],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
