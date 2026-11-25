import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { vi } from 'vitest';
import { ProdutosService } from './produtos.service.js';
import { Produto } from './schemas/produto.schema.js';

describe('ProdutosService', () => {
  let service: ProdutosService;
  // Model falso: os testes não precisam do MongoDB.
  const produtoModel = { create: vi.fn() };
  const dto = {
    nome: 'Torno CNC X200',
    preco: 15000,

    categoria: 'Ferramentas',
  };
  beforeEach(async () => {
    produtoModel.create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: getModelToken(Produto.name),
          useValue: produtoModel,
        },
      ],
    }).compile();
    service = module.get<ProdutosService>(ProdutosService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create deve devolver o documento gravado', async () => {
    produtoModel.create.mockResolvedValue({
      _id: 'abc123',
      ...dto,
    });
    const criado = await service.create(dto);
    expect(produtoModel.create).toHaveBeenCalledWith(dto);
    expect(criado).toMatchObject({ _id: 'abc123' });
  });
  it('create deve lançar 409 para nome duplicado (11000)', async () => {
    produtoModel.create.mockRejectedValue({
      code: 11000,
    });
    await expect(service.create(dto)).rejects.toThrow(
      new ConflictException('Este equipamento já está registrado no sistema'),
    );
  });
  it('create deve lançar 400 para ValidationError', async () => {
    produtoModel.create.mockRejectedValue({
      name: 'ValidationError',
      errors: {
        categoria: { message: 'categoria inválida' },
      },
    });
    await expect(service.create(dto)).rejects.toThrow(
      new BadRequestException('categoria inválida'),
    );
  });
  it('create deve repassar outros erros', async () => {
    const falha = new Error('banco fora do ar');
    produtoModel.create.mockRejectedValue(falha);
    await expect(service.create(dto)).rejects.toBe(falha);
  });
  it('findOne deve retornar o produto encontrado', () => {
    expect(service.findOne('1')).toEqual({
      id: 1,
      nome: 'Notebook',
      preco: 3500,
    });
  });

  it('findOne deve lançar BadRequestException para ID não numérico', () => {
    expect(() => service.findOne('abc')).toThrow(
      new BadRequestException('O ID fornecido deve ser do tipo inteiro'),
    );
  });
  it('findOne deve lançar NotFoundException para ID inexistente', () => {
    expect(() => service.findOne('999')).toThrow(
      new NotFoundException('Produto com ID 999 não encontrado'),
    );
  });
});
