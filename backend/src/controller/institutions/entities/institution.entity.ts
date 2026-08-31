import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstitutionDocument = Institution & Document;

export enum InstitutionType {
  SCHOOL = 'SCHOOL',
  COLLEGE = 'COLLEGE',
  TUITION = 'TUITION',
  COACHING = 'COACHING',
}

@Schema({ timestamps: true })
export class Institution {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: InstitutionType })
  type: InstitutionType;

  @Prop({ required: true, unique: true })
  tenantId: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, unique: true })
  dbName: string;

  @Prop({ required: true })
  adminName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: 'FREE' })
  plan: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
