// Aquivo responsavel por criar pagina inicial na rota /
const express = require('express');
const router = express.Router();

// Rota para pagina inicial
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;