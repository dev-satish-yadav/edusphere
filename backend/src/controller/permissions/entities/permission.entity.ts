import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, unique: true, lowercase: true })
  name: string; // e.g., 'student.create', 'student.read'

  @Prop()
  description: string;

  @Prop({ required: true })
  module: string; // e.g., 'Student', 'Fee'
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
