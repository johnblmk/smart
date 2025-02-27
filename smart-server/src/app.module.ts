import {MiddlewareConsumer, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Book} from "./entities/book.entity";
import {Author} from "./entities/author.entity";
import { ServeStaticModule } from '@nestjs/serve-static';
import {Quarto} from "./entities/quarto.entity";
import {IdentifyMiddleware} from "./middleware/identity.middleware";


@Module({
  imports: [

      TypeOrmModule.forRoot({
        type: "mysql",
        host: '18.222.187.74',
        port: 4444,
        database: "smart",
        username: "root",
        password: 'zest',
        entities: [Book, Author, Quarto],
        autoLoadEntities: true,
        synchronize: false
      }),
      TypeOrmModule.forFeature([Book, Author, Quarto]),

      ServeStaticModule.forRoot({
        rootPath: '/var/smart/client/build',
      }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(IdentifyMiddleware).forRoutes('*'); // Apply middleware to all routes
    }
}
