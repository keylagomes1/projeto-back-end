const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')
const verificarToken = require('../middlewares/verificarToken1');

const prisma = new PrismaClient();

// Criar opcoesProduto
router.post('/', verificarToken, async (req, res) => {
    const { produto_id, titulo, shape, radius, type, valores_produto } = req.body;
    try {
        const opcoesProduto = await prisma.opcoesProduto.create({
            data: { produto_id, titulo, shape, radius, type, valores_produto}
        });
        res.json(opcoesProduto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar opcoesProduto
router.get('/', verificarToken, async (req, res) => {
    const opcoesProduto = await prisma.opcoesProduto.findMany();
    res.json(opcoesProduto);
});
// Listar por ID
router.get('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  const opcoesProduto = await prisma.opcoesProduto.findUnique({ where: { id } });
  if (!opcoesProduto) return res.status(404).json({ error: 'OpcoesProdutos   não encontrado' });
  res.json(opcoesProduto);
});


// Atualizar opcoesProduto
router.put('/:id', verificarToken,  async (req, res) => {
    const { id } = req.params;
    const { produto_id, titulo, shape, radius, type, valores_produto } = req.body;
    try {
        const opcoesProduto = await prisma.opcoesProduto.update({
            where: { id: parseInt(id) },
            data: { produto_id, titulo, shape, radius, type, valores_produto }
        });
        res.json(opcoesProduto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', verificarToken,  async (req, res) => {
  const id = Number(req.params.id);
  const updatedopcoesProduto = await prisma.opcoesProduto.update({
    where: { id },
    data: req.body
  });
  res.json(updatedopcoesProduto);
});


// Deletar opcoesProduto
router.delete('/:id', verificarToken, async (req, res) => {
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
