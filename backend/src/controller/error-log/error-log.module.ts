import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '../admin/admin.module';
import { ErrorLog, ErrorLogSchema } from './entities/error-log.entity';
import { ErrorlogController } from './error-log.controller';
import { ErrorLogDAO } from './error-log.dao';
import { ErrorlogService } from './error-log.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ErrorLog.name, schema: ErrorLogSchema }]),
    forwardRef(() => AdminModule),
  ],
  exports: [ErrorlogService],
  providers: [ErrorlogService, ErrorLogDAO],
  controllers: [ErrorlogController],
})
export class ErrorlogModule {}
