import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { configuration } from '../configuration';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { Vote } from './votes/entities/vote.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('db.type') as any,
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
        entities: [User, Message, Vote],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Message, Vote]),
    ConfigModule.forRoot({
      envFilePath:
        // Set config file for different environment variable files by NODE_ENV
        process.env.NODE_ENV == 'production'
          ? `${process.cwd()}/production.env`
          : `${process.cwd()}/.env`,
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
