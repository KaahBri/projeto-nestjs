import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'HOHOHO, qual é o seu pedido? || Servidor Nest.js Ativo';
  }
}

