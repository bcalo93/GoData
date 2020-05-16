const arenaController = require('./arenaController')

const express = require('express');
const router = express.Router();

router.use('/', arenaController.arena);