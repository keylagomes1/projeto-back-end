const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Criar Produto
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedProdutos = await prisma.produtos.update({
    where: { id },
    data: req.body
  });
  res.json(updatedProdutos);
});


// Deletar Produto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.produtos.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Produto deletado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
