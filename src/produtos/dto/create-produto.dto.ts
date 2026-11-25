import { ApiProperty } from '@nestjs/swagger';
// Aula 17: os exemplos aparecem prontos no Swagger UI.

// Aula 21: campo categoria acrescentado.
export class CreateProdutoDto {
  @ApiProperty({ example: 'Torno CNC X200' })
  nome: string;
  @ApiProperty({ example: 25.9 })
  preco: number;
  @ApiProperty({
    example: 'Ferramentas',
    enum: ['Eletrônicos', 'Ferramentas', 'EPI'],
  })
  categoria: string;
}
