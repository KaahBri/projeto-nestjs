import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ProdutosController } from './produtos.controller.js';
import { ProdutosService } from './produtos.service.js';
describe('ProdutosController', () => {
let controller: ProdutosController;
// Service falso: o controller é testado sem o Mongoose.
const produtosService = {
create: vi.fn(),
findAll: vi.fn(),
findOne: vi.fn(),
update: vi.fn(),
};
beforeEach(async () => {
const module: TestingModule =
await Test.createTestingModule({
controllers: [ProdutosController],
providers: [
{



provide: ProdutosService,
useValue: produtosService,
},
],
}).compile();
controller = module.get<ProdutosController>(
ProdutosController,
);
});
it('should be defined', () => {
expect(controller).toBeDefined();
});
it('buscarPorId deve devolver o produto', async () => {
produtosService.findOne.mockResolvedValue({
nome: 'Mouse',
});
const produto = await controller.buscarPorId('abc');
expect(

produtosService.findOne,
).toHaveBeenCalledWith('abc');
expect(produto).toMatchObject({ nome: 'Mouse' });
});
it('atualizar deve repassar o id e os campos', async () => {
produtosService.update.mockResolvedValue({
preco: 2500,
});
const resultado = await controller.atualizar(
'abc',
{
preco: 2500,
},
);
expect(produtosService.update).toHaveBeenCalledWith(
'abc',
{ preco: 2500 },
);
expect(resultado).toEqual({ preco: 2500 });
});


it('criar deve devolver o documento criado', async () => {
const dto = {
nome: 'Torno CNC X200',
preco: 15000,
categoria: 'Ferramentas',
};
produtosService.create.mockResolvedValue({
_id: 'abc123',
...dto,
});
const criado = await controller.criar(dto);
expect(produtosService.create).toHaveBeenCalledWith(
dto,
);
expect(criado).toMatchObject({ _id: 'abc123' });
});
it('findAll deve repassar os filtros ao service', async () => {
const filtros = { categoria: 'EPI', pagina: '2' };
produtosService.findAll.mockResolvedValue([

{ nome: 'Luva' },
]);
const lista = await controller.findAll(filtros);
expect(
produtosService.findAll,
).toHaveBeenCalledWith(filtros);
expect(lista).toHaveLength(1);
});
});