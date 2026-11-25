import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConvidadosController } from './convidados/convidados.controller.js';
import { ConvidadosService } from './convidados/convidados.service.js';
import { LivrosController } from './livros/livros.controller.js';
import { LivrosService } from './livros/livros.service.js';
import { MediaController } from './media/media.controller.js';
import { SegurancaController } from './seguranca/seguranca.controller.js';
import { AdminController } from './admin/admin.controller.js';
import { LoggerMiddleware } from './logger/logger.middleware.js';
import { ProdutosController } from './produtos/produtos.controller.js';
import { ProdutosService } from './produtos/produtos.service.js';
import { ColaboradoresController } from './colaboradores/colaboradores.controller.js';

@Module({
  imports: [
    // Aula 18: variáveis de ambiente em toda a aplicação.
    ConfigModule.forRoot({ isGlobal: true }),
    // Aula 19: conexão com o MongoDB gerenciada pelo Nest
    // (substitui o mongoose.connect() manual do main.ts).
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        // Sem isto, cada tentativa espera até 30 s.

        serverSelectionTimeoutMS: 3000,
        // O Nest usa createConnection(): os eventos NÃO
        // disparam em mongoose.connection (a global).
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => {
            console.log('Mongoose conectado ao MongoDB com sucesso!');
          });
          connection.on('error', (error: Error) => {
            console.error('Erro na conexão do Mongoose:', error.message);
          });
          connection.on('disconnected', () => {
            console.warn('Mongoose desconectado do MongoDB.');
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    ConvidadosController,
    LivrosController,
    MediaController,
    SegurancaController,
    AdminController,
    ProdutosController,

    ColaboradoresController,
  ],
  providers: [AppService, ConvidadosService, LivrosService, ProdutosService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicado a todas as rotas da aplicação.
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
