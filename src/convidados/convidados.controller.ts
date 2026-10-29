import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateConvidadoDto } from './dto/convidado.dto.js';

@Controller('convidados')
export class ConvidadosController {
  private readonly convidados = ['Ana', 'Bruno', 'Carlos','Kassya', 'Amity', 'Luz', 'Ravena', 'loak'];

  // GET /convidados
  @Get()
  listarTodos(): string[] {
    return this.convidados;
  }

  // POST /convidados
  @Post()
  criar(@Body() createConvidadoDto: CreateConvidadoDto) {
    console.log('Convidado recebido:', createConvidadoDto.nome);
    return {
      mensagem: `Convidado ${createConvidadoDto.nome} confirmado com sucesso!`,
      dados: createConvidadoDto,
    };
  }
}
