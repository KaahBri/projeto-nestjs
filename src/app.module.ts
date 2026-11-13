import {MiddlewareConsumer, Module,NestModule,} from '@nestjs/common'
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


@Module({
    imports: [],
    controllers: [ AppController, ConvidadosController, LivrosController, MediaController, SegurancaController,AdminController, ProdutosController,]
    , providers: [ AppService, ConvidadosService,LivrosService, ProdutosService,
],})


export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Aplicado a todas as rotas da aplicação.
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}