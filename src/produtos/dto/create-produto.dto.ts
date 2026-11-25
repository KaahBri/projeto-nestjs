import { ApiProperty } from '@nestjs/swagger';

// Aula 17: os exemplos aparecem prontos no Swagger UI.
export class CreateProdutoDto {
@ApiProperty({ example: 'Arroz 5kg' })
nome: string;
@ApiProperty({ example: 25.9 })
preco: number;
}