import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Produto as ProdutoMemoria } from './interfaces/produto.interface.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { Produto } from './schemas/produto.schema.js';

@Injectable()
export class ProdutosService {
  // Aula 15: acervo simulado em memória (GET por ID).
  // As buscas só migram para o MongoDB na próxima aula.
  private readonly produtos: ProdutoMemoria[] = [
    { id: 1, nome: 'Notebook', preco: 3500 },
    { id: 2, nome: 'Mouse', preco: 80 },
    { id: 3, nome: 'Teclado', preco: 150 },
  ];
  // Aula 21: o Model do Mongoose é injetado no Service.
  constructor(
    @InjectModel(Produto.name)
    private readonly produtoModel: Model<Produto>,
  ) {}
  // Aula 21: Atividade Prática "Cadastro de Maquinário
  // Industrial". Grava de verdade no MongoDB.
  async create(createProdutoDto: CreateProdutoDto) {
    try {
      return await this.produtoModel.create(createProdutoDto);
    } catch (error) {
      // Duplicidade (nome com unique: true): código 11000.
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException(
          'Este equipamento já está registrado no sistema',
        );
      }
      // Regras do Schema (enum, min...): ValidationError.
      if ((error as Error).name === 'ValidationError') {
        const mensagens = Object.values(
          (
            error as unknown as {
              errors: Record<string, { message: string }>;
            }
          ).errors,
        ).map((e) => e.message);
        throw new BadRequestException(mensagens.join(', '));
      }
      throw error;
    }
  }
  findOne(idParam: string): ProdutoMemoria {
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
