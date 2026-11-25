import { Test, TestingModule } from '@nestjs/testing';
import { ColaboradoresController } from './colaboradores.controller.js';


describe('ColaboradoresController', () => {
  let controller: ColaboradoresController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColaboradoresController],
    }).compile();
    controller = module.get<ColaboradoresController>(ColaboradoresController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create deve confirmar o cadastro', () => {
    const resultado = controller.create({
      nome: 'Ana Souza',
      email: 'ana@email.com',
      idade: 30,
      departamento: 'TI',
    });
    expect(resultado.mensagem).toBe(
      'Colaborador Ana Souza cadastrado com sucesso!',
    );
  });
});
