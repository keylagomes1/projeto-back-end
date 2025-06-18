const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/user');
const produtosRoutes = require('./routes/produtos');
const opcoesProdutoRoutes = require('./routes/opcoesProduto');
const categoriaRoutes = require('./routes/categoria');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/produtos', produtosRoutes);
app.use('/opcoesProdutos', opcoesProdutoRoutes);
app.use('/categoria', categoriaRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
