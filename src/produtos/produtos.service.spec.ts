import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProdutosService } from './produtos.service.js';


describe('ProdutosService', () => {
  let service: ProdutosService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutosService],
    }).compile();
    service = module.get<ProdutosService>(ProdutosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create deve cadastrar com o próximo ID', () => {
    const criado = service.create({
      nome: 'Arroz 5kg',
      preco: 25.9,
    });
    expect(criado).toEqual({
      id: 4,
      nome: 'Arroz 5kg',
      preco: 25.9,
    });
    expect(service.findOne('4')).toEqual(criado);
  });
  it('findOne deve retornar o produto encontrado', () => {
    expect(service.findOne('1')).toEqual({
      id: 1,
      nome: 'Notebook',
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
