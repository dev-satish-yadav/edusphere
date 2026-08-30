import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../../roles/entities/role.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ required: true, type: String, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: Number })
  age?: number;

  @Prop({ required: false })
  tenantId: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({ type: String, enum: ['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT'] })
  userType: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
