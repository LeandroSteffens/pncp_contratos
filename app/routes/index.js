const express = require('express');
const router = express.Router();

const axios = require('axios');
const db = require('../db/db'); // Impota arquivo e funções de inserir no banco de dados


/* Define o retorno da pagina inicial na rota /. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buscarContratos', async function(req, res, next) {
  const { cnpj, dataInicial, dataFinal } = req.body;
  const url = `https://pncp.gov.br/api/consulta/v1/contratos?dataInicial=${dataInicial}&dataFinal=${dataFinal}&cnpjOrgao=${cnpj}&pagina=1`;
  console.error(url)
  try {
    console.error(url)
    const response = await axios.get(url);


    const contracts = response.data.data;

    // Inserir contratos no banco de dados
    contracts.forEach(contract => {
      db.run(`INSERT INTO contracts (cnpj, razaoSocial, dataVigenciaInicio, dataVigenciaFim, nomeRazaoSocialFornecedor, objetoContrato, valorInicial) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        contract.orgaoEntidade.cnpj,
        contract.orgaoEntidade.razaoSocial,
        contract.dataVigenciaInicio,
        contract.dataVigenciaFim,
        contract.nomeRazaoSocialFornecedor,
        contract.objetoContrato,
        contract.valorInicial
      ]);
    });

    // Calcular o valor total dos contratos
    const totalValue = contracts.reduce((sum, contract) => sum + contract.valorInicial, 0);

    res.render('results', {
      orgao: contracts[0].orgaoEntidade,
      contracts: contracts,
      totalValue: totalValue
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
