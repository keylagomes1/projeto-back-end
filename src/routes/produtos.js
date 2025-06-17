const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verificarToken = require('../middlewares/verificarToken1');

const prisma = new PrismaClient();

// Criar Produto
router.post('/',verificarToken, async (req, res) => {
    const { nome, slug, use_in_menu, stock , descricao, preco, preco_com_desconto} = req.body;
    try {
        const produtos = await prisma.produtos.create({
            data: { nome, slug, use_in_menu,  stock , descricao, preco, preco_com_desconto   }
        });
        res.json(produtos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar Produto
router.get('/', verificarToken , async (req, res) => {
    const produtos = await prisma.produtos.findMany();
    res.json(produtos);
});
// Listar por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const produtos = await prisma.produtos.findUnique({ where: { id } });
  if (!produtos) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(produtos);
});


// Atualizar Produto
router.put('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { nome, slug, use_in_menu  } = req.body;
    try {
        const produtos = await prisma.produtos.update({
            where: { id: parseInt(id) },
            data: { nome, slug, use_in_menu,  stock , descricao, preco, preco_com_desconto   }
        });
        res.json(produtos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', verificarToken ,  async (req, res) => {
  const id = Number(req.params.id);
  const updatedProdutos = await prisma.produtos.update({
    where: { id },
    data: req.body
  });
  res.json(updatedProdutos);
});


// Deletar Produto
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return res.json({ message: 'Produto já foi excluído ou não existe.' });
    }

    // Tenta deletar
    await prisma.produtos.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    if (error.code === 'P2003') {
      // Erro Prisma para violação de FK
      return res.status(400).json({ error: 'Não é possível excluir o produto: ele está em uso em outras tabelas.' });
    }

    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
