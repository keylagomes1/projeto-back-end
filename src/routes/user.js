const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middlewares/verificarToken1');

require('dotenv').config();

const prisma = new PrismaClient();

// 🔐 LOGIN (gera token)
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaConfere = await bcrypt.compare(senha, user.senha);
    if (!senhaConfere) return res.status(401).json({ error: 'Senha incorreta' });

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 CRIAR usuário
router.post('/', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;
  if (!nome || !sobrenome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser){
    return res.status(400).json({ error: 'Usuário já existe' });
  }
  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const user = await prisma.user.create({
      data: { nome, sobrenome, email, senha: hashedPassword },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔐 LISTAR TODOS (com token obrigatório)
router.get('/', verificarToken, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// 🔎 LISTAR POR ID
router.get('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// 🔄 ATUALIZAR usuário
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { nome, sobrenome, email, senha: hashedPassword },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✏️ ATUALIZAR com PATCH
router.patch('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ DELETAR usuário
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.json({ message: 'Usuário já foi excluído ou não existe.' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
