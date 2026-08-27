import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminDAO } from './admin.dao';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './entities/admin.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  exports: [AdminService],
  providers: [AdminService, AdminDAO],
  controllers: [AdminController],
})
export class AdminModule {}
