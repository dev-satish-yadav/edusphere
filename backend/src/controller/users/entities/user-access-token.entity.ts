import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserAccessTokenDocument = UserAccessToken & Document;

@Schema({ timestamps: true, collection: 'user_access_tokens' })
export class UserAccessToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  token: string;
}

export const UserAccessTokenSchema = SchemaFactory.createForClass(UserAccessToken);
