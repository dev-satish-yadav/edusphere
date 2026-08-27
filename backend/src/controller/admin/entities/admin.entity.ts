import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({
  timestamps: true,
  // Never let the hash leave the app, whatever the caller selected.
  toJSON: {
    transform: (_doc, ret: Record<string, unknown>) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Admin {
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ required: true, type: String, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ type: String, default: 'admin', enum: ['admin', 'superadmin'] })
  role: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
