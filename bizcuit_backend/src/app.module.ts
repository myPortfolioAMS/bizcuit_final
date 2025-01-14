import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TaskModule } from './tasks/tasks.module';
import { Task } from './tasks/tasks.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5437,
      username: process.env.DB_USERNAME || 'bizcuit_user',
      password: process.env.DB_PASSWORD || 'bizcuit_password',
      database: process.env.DB_NAME || 'bizcuit_database',
      entities: [Task, User],
      synchronize: process.env.DB_SYNC === 'true',
      logging: true,
    }),
    AuthModule,
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    const entities = this.dataSource.entityMetadatas.map((meta) => meta.name);
    console.log('Entities registered:', entities);
  }
}
