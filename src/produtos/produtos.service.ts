import {
BadRequestException,
ConflictException,
Injectable,
NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';
import { FiltrosProdutoDto } from './dto/filtros-produto.dto.js';
import { Produto } from './schemas/produto.schema.js';
// Aula 22: tamanho fixo da página.
const ITENS_POR_PAGINA = 5;
// Aula 23: abaixo disto o estoque é considerado crítico.
const ESTOQUE_CRITICO = 5;
@Injectable()
export class ProdutosService {
// Aula 21: o Model do Mongoose é injetado no Service.
constructor(
@InjectModel(Produto.name)

private readonly produtoModel: Model<Produto>,
) {}
// Aula 21: Atividade Prática "Cadastro de Maquinário
// Industrial". Grava de verdade no MongoDB.
async create(createProdutoDto: CreateProdutoDto) {
try {
return await this.produtoModel.create(
createProdutoDto,
);
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
errors: Record<



string,
{ message: string }
>;
}
).errors,
).map((e) => e.message);
throw new BadRequestException(
mensagens.join(', '),
);
}
throw error;
}
}
// Aula 22: filtro por categoria, ordenação por preço e
// paginação de 5 itens. select('-__v') impede que o campo
// de versão do Mongoose apareça na resposta.
async findAll(filtros: FiltrosProdutoDto) {
const pagina =
Number(filtros.pagina) > 0
? Number(filtros.pagina)
: 1;
const skip = (pagina - 1) * ITENS_POR_PAGINA;


const query: { categoria?: string } = {};
if (filtros.categoria) {
query.categoria = filtros.categoria;
}
const sort: Record<string, 1 | -1> = {};
if (filtros.ordenar === 'preco_asc') sort.preco = 1;
if (filtros.ordenar === 'preco_desc')
sort.preco = -1;
return this.produtoModel
.find(query)
.select('-__v')
.sort(sort)
.skip(skip)
.limit(ITENS_POR_PAGINA)
.exec();
}
// Aula 23: o GET por ID agora também lê do MongoDB.
async findOne(id: string) {
let produto: Produto | null;

try {
produto = await this.produtoModel
.findById(id)
.select('-__v');
} catch (error) {
this.tratarErro(error);
}
if (!produto) {
throw new NotFoundException(
`Produto com ID ${id} não encontrado`,
);
}
return produto;
}
// Aula 23: Atividade Prática "Atualização de Status
// Industrial".
async update(id: string, dto: UpdateProdutoDto) {
// Só os campos editáveis entram no $set: _id, createdAt
// e __v nunca são alterados, mesmo que venham no corpo.
const campos: UpdateProdutoDto = {};
if (dto.nome !== undefined) campos.nome = dto.nome;
if (dto.preco !== undefined)

campos.preco = dto.preco;
if (dto.categoria !== undefined)
campos.categoria = dto.categoria;
if (dto.estoque !== undefined)
campos.estoque = dto.estoque;
if (dto.ativo !== undefined)
campos.ativo = dto.ativo;
let atualizado: Produto | null;
try {
atualizado = await this.produtoModel
.findByIdAndUpdate(
id,
{ $set: campos },
{
returnDocument: 'after',
runValidators: true,
},
)
.select('-__v');
} catch (error) {
this.tratarErro(error);
}

if (!atualizado) {
throw new NotFoundException(
`Produto com ID ${id} não encontrado`,
);
}
// Regra de negócio: alerta de estoque crítico.
if (
campos.estoque !== undefined &&
campos.estoque < ESTOQUE_CRITICO
) {
console.log('Atenção: Estoque Crítico');
}
return atualizado;
}
// Aula 24: Atividade Prática "Limpeza Segura de Estoque".
// Reaproveita o findOne() para validar o ID (400) e a
// existência (404) e para ler o estoque antes de apagar.
async delete(id: string): Promise<void> {
const produto = await this.findOne(id);
// Regra de segurança: nunca excluir com itens em estoque.

if (produto.estoque > 0) {
throw new BadRequestException(
'Não é possível excluir produtos com itens em estoque',
);
}
await this.produtoModel.findByIdAndDelete(id);
}
// Converte erros do MongoDB/Mongoose em erros HTTP.
private tratarErro(error: unknown): never {
const e = error as {
name?: string;
code?: number;
path?: string;
message?: string;
errors?: Record<string, { message: string }>;
};
if (e.name === 'CastError') {
throw new BadRequestException(
e.path === '_id'
? 'O ID fornecido não é um ObjectId válido'
: e.message,


);
}
if (e.code === 11000) {
throw new ConflictException(
'Este equipamento já está registrado no sistema',
);
}
if (e.name === 'ValidationError' && e.errors) {
throw new BadRequestException(
Object.values(e.errors)
.map((x) => x.message)
.join(', '),
);
}
throw error;
}
}