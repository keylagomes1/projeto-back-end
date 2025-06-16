const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Criar categoria
router.post('/', async (req, res) => {
    const { nome, slug, use_in_menu } = req.body;
    try {
        const categoria = await prisma.categoria.create({
            data: { nome, slug, use_in_menu }
        });
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar categorias
router.get('/', async (req, res) => {
    const categoria = await prisma.categoria.findMany();
    res.json(categoria);
});

// Listar categoria por ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
});

// Atualizar categoria (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, slug, use_in_menu } = req.body;
    try {
        const categoria = await prisma.categoria.update({
            where: { id: parseInt(id) },
            data: { nome, slug, use_in_menu }
        });
        res.json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Atualizar parcialmente categoria (PATCH)
router.patch('/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const categoriaAtualizada = await prisma.categoria.update({
            where: { id },
            data: req.body
        });
        res.json(categoriaAtualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Deletar categoria
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.categoria.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Categoria deletada' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
