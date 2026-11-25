import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { colaboradorSchema } from './schemas/colaborador.schema.js';
import type { CreateColaboradorDto } from './schemas/colaborador.schema.js';


@Controller('colaboradores')
export class ColaboradoresController {
  // POST /colaboradores
  @Post()
  @UsePipes(new ZodValidationPipe(colaboradorSchema))
  create(@Body() colaborador: CreateColaboradorDto) {
    return {
      mensagem: `Colaborador ${colaborador.nome} cadastrado com sucesso!`,
      dados: colaborador,
    };
  }
}
