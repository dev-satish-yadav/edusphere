import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserAccessToken, UserAccessTokenSchema } from './entities/user-access-token.entity';
import { UsersController } from './users.controller';
import { UsersDAO } from './users.dao';
import { UserAccessTokenDAO } from './user-access-token.dao';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAccessToken.name, schema: UserAccessTokenSchema },
    ]),
  ],
  exports: [UsersService],
  providers: [UsersService, UsersDAO, UserAccessTokenDAO],
  controllers: [UsersController],
})
export class UsersModule {}
