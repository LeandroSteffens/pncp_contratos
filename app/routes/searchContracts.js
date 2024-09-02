// Arquivo responsavel por expor rota por buscar contratos e inserir no banco de dados

// Realiza as importações necessárias
const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db/db");
const { dateToString } = require("../utils/utils");

// Função para inserir contratos no banco de dados
const insertContractsIntoDB = (contracts) => {
  contracts.forEach((contract) => {
    db.run(
      `INSERT INTO contracts (cnpj, razaoSocial, dataVigenciaInicio, dataVigenciaFim, nomeRazaoSocialFornecedor, objetoContrato, valorInicial) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        contract.orgaoEntidade.cnpj,
        contract.orgaoEntidade.razaoSocial,
        contract.dataVigenciaInicio,
        contract.dataVigenciaFim,
        contract.nomeRazaoSocialFornecedor,
        contract.objetoContrato,
        contract.valorInicial,
      ]
    );
  });
};

// Função para calcular o valor total dos contratos
const calculateTotalValue = (contracts) => {
  return contracts.reduce((sum, contract) => sum + contract.valorInicial, 0);
};

const makeRequest = async (url, mockResponse) => {
  let response;
  try {
    response = await axios.get(url, { timeout: 5000 });
  } catch (error) {
    response = mockResponse;
  }
  return response;
};

// Rota para buscar contratos e salvar no banco de dados
router.get("/buscarContratos", async (req, res, next) => {
  const { cnpj, dataInicial, dataFinal } = req.query;
  const url = `https://pncp.gov.br/api/consulta/v1/contratos?dataInicial=${dateToString(
    dataInicial
  )}&dataFinal=${dateToString(dataFinal)}&cnpjOrgao=${cnpj}&pagina=1`;

  try {
    const response = await makeRequest(url, simuleResponse); // Realiza a request para o endpoint da API, simula o resultado em caso de falha
    const contracts = response.data;

    insertContractsIntoDB(contracts); // Chama funcao que realiza a inserção dos contratos no banco de dados
    const totalValue = calculateTotalValue(contracts); // Calcula o valor total dos contratos da busca realizada

    // renderiza na tela a tela de resultados baseado na resposta da API
    res.render("results", {
      orgao: contracts[0].orgaoEntidade,
      contracts: contracts,
      totalValue: totalValue,
    });
  } catch (error) {
    next(error);
  }
});

// Simule a resposta caso a API não esteja disponível ou devolva algum erro não esperado
const simuleResponse = {
  data: Array.from({ length: 10 }, (_, i) => ({
    numeroControlePncpCompra: `12345${i}`,
    codigoPaisFornecedor: "BR",
    orgaoSubRogado: {
      cnpj: `1234567800010${i}`,
      razaoSocial: `Orgao SubRogado ${i}`,
      poderId: "1",
      esferaId: "1",
    },
    orgaoEntidade: {
      cnpj: `1234567800010${i + 1}`,
      razaoSocial: `Orgao Entidade ${i}`,
      poderId: "1",
      esferaId: "1",
    },
    anoContrato: 2023,
    tipoContrato: {
      id: 1,
      nome: `Tipo ${i}`,
    },
    numeroContratoEmpenho: `123456${i}`,
    dataAssinatura: "2024-09-01",
    dataVigenciaInicio: "2024-09-01",
    dataVigenciaFim: "2024-09-01",
    niFornecedor: `12345678${i}`,
    tipoPessoa: "PJ",
    categoriaProcesso: {
      id: 1,
      nome: `Categoria ${i}`,
    },
    dataPublicacaoPncp: "2024-08-31T10:44:08",
    dataAtualizacao: "2024-08-31T10:44:08",
    sequencialContrato: i + 1,
    unidadeOrgao: {
      ufNome: "São Paulo",
      codigoUnidade: `SP0${i}`,
      nomeUnidade: `Unidade ${i}`,
      ufSigla: "SP",
      municipioNome: "São Paulo",
      codigoIbge: "3550308",
    },
    informacaoComplementar: `Informação complementar ${i}`,
    processo: `Processo ${i}`,
    unidadeSubRogada: {
      ufNome: "Rio de Janeiro",
      codigoUnidade: `RJ0${i}`,
      nomeUnidade: `Unidade ${i + 1}`,
      ufSigla: "RJ",
      municipioNome: "Rio de Janeiro",
      codigoIbge: "3304557",
    },
    nomeRazaoSocialFornecedor: `Fornecedor ${i}`,
    niFornecedorSubContratado: `87654321${i}`,
    nomeFornecedorSubContratado: `Fornecedor Subcontratado ${i}`,
    numeroControlePNCP: `54321${i}`,
    receita: true,
    tipoPessoaSubContratada: "PJ",
    objetoContrato: `Objeto do contrato ${i}`,
    valorInicial: 1000 + i * 100,
    numeroParcelas: 10,
    valorParcela: 100,
    valorGlobal: 1000 + i * 100,
    valorAcumulado: 1000 + i * 100,
    numeroRetificacao: 0,
    identificadorCipi: `CIPI12345${i}`,
    urlCipi: `http://example.com/cipi12345${i}`,
    usuarioNome: `Usuário ${i}`,
  })),
  totalRegistros: 10,
  totalPaginas: 1,
  numeroPagina: 1,
  paginasRestantes: 0,
  empty: false,
};

module.exports = router;
