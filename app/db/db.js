// Arquivo responsavel por gerenciar o banco de dados sqlite
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./contracts.db"); // Inicializa o banco de dados de contrato

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cnpj TEXT,
    razaoSocial TEXT,
    dataVigenciaInicio TEXT,
    dataVigenciaFim TEXT,
    nomeRazaoSocialFornecedor TEXT,
    objetoContrato TEXT,
    valorInicial REAL
  )`);
});

module.exports = db;
