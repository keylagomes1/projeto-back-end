const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

// Criar opcoesProduto
router.post('/', async (req, res) => {
    const { produto_id, titulo, shape, radius, type, valores_produtos } = req.body;
    try {
        const opcoesProduto = await prisma.opcoesProduto.create({
            data: { produto_id, titulo, shape, radius, type, valores_produtos}
        });
        res.json(opcoesProduto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar opcoesProduto
router.get('/', async (req, res) => {
    const opcoesProduto = await prisma.opcoesProduto.findMany();
    res.json(opcoesProduto);
});
// Listar por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const opcoesProduto = await prisma.opcoesProduto.findUnique({ where: { id } });
  if (!opcoesProduto) return res.status(404).json({ error: 'OpcoesProdutos   não encontrado' });
  res.json(opcoesProduto);
});


// Atualizar opcoesProduto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { produto_id, titulo, shape, radius, type, valores_produtos } = req.body;
    try {
        const opcoesProduto = await prisma.opcoesProduto.update({
            where: { id: parseInt(id) },
            data: { produto_id, titulo, shape, radius, type, valores_produtos }
        });
        res.json(opcoesProduto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedopcoesProduto = await prisma.opcoesProduto.update({
    where: { id },
    data: req.body
  });
  res.json(updatedopcoesProduto);
});


// Deletar opcoesProduto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.opcoesProduto.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'OpcoesProdutos deletado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
