import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller.js';
import { ProdutosService } from './produtos.service.js';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [ProdutosService],
    }).compile();
    controller = module.get<ProdutosController>(ProdutosController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('buscarPorId deve devolver o produto', () => {
    expect(controller.buscarPorId('2').nome).toBe('Mouse');
  });
  it('criar deve devolver o produto com ID', () => {
    const criado = controller.criar({
      nome: 'Arroz 5kg',
      preco: 25.9,
    });
    expect(criado.id).toBe(4);
    expect(criado.nome).toBe('Arroz 5kg');
  });
});
