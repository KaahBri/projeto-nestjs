import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Produto } from './interfaces/produto.interface.js';

@Injectable()
export class ProdutosService {
  // Aula 15: acervo simulado em memória.
  // Atividade Prática "O Sistema Anti-Falhas".
  private readonly produtos: Produto[] = [
    { id: 1, nome: 'Notebook', preco: 3500 },
    { id: 2, nome: 'Mouse', preco: 80 },
    { id: 3, nome: 'Teclado', preco: 150 },
    { id: 4, nome: 'Monitor', preco: 800 },
    { id: 5, nome: 'fone de ouvido gamer pro max', preco: 4000 },
    { id: 6, nome: 'Mouse, o radinho da sua casa', preco: 100 },
  ];
  
  findOne(idParam: string): Produto {
    // Erro 1: o ID da rota não é um número inteiro.
    if (!/^\d+$/.test(idParam)) {
      throw new BadRequestException('O ID fornecido deve ser do tipo inteiro');
    }

    const id = Number(idParam);
    const produto = this.produtos.find((p) => p.id === id);
    // Erro 2: ID válido, mas nenhum produto com ele.
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return produto;
  }
}
