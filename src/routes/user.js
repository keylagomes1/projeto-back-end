const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

// Criar usuário
router.post('/', async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;
    const verifyEmail = await prisma.user.findUnique({ where: { email } });
    if (verifyEmail) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
        }
    const hashedPassword = await bcrypt.hash(senha, 10);
    try {
        const user = await prisma.user.create({
            data: { nome, sobrenome, email, senha: hashedPassword }
        });
        delete user.senha;
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar usuários
router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
// Listar por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});


// Atualizar usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, email, senha } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { nome, sobrenome, email, senha }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: req.body
  });
  res.json(updatedUser);
});


// Deletar usuário
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Usuário deletado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
