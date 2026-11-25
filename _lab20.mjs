import mongoose from 'mongoose';
import { ProdutoSchema } from
'./dist/produtos/schemas/produto.schema.js';
await mongoose.connect('mongodb://localhost:27017/lab-aula20');
const Produto = mongoose.model('Produto', ProdutoSchema);
const ok = new Produto({
nome: ' Capacete ', preco: 49.9, categoria: 'EPI',
});
await ok.save();
console.log('OK', JSON.stringify(ok.toObject()));
const casos = {
'sem nome': { preco: 1, categoria: 'EPI' },
'preco negativo': { nome: 'X', preco: -5, categoria: 'EPI' },
'categoria invalida': { nome: 'X', preco: 1, categoria: 'Roupas' },
'estoque negativo': { nome: 'X', preco: 1, categoria: 'EPI', estoque: -1 },
'preco como texto': { nome: 'X', preco: 'abc', categoria: 'EPI' },


'campo extra': { nome: 'Y', preco: 1, categoria: 'EPI', cor: 'azul' },
'preco texto numerico': { nome: 'Z', preco: '10', categoria: 'EPI' },
};
for (const [t, d] of Object.entries(casos)) {
try {
const x = await new Produto(d).save();
console.log('SALVOU', t, JSON.stringify(x.toObject()));
} catch (e) {
console.log('ERRO', t, '->', Object.values(e.errors ?? {})
.map((v) => v.message).join(' | ') || e.message);
}
}
await mongoose.connection.dropDatabase();
await mongoose.disconnect();