import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TweetsModule, EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
