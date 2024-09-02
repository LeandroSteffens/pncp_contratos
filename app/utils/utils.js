// Arquivo responsavel por conter funções uteis para o sistema, como conversões e manipulações de dados
function dateToString(dateString) {
  if (!dateString) {
    return "";
  }
  return dateString.replace(/-/g, "");
}

function removeCnpjMask(cnpj) {
  if (!cnpj) {
    return "";
  }
  return cnpj.replace(/\D/g, "");
}

module.exports = { dateToString, removeCnpjMask };
