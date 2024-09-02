
// Arquivo  responsavel por conter funções uteis para o sistema, como conversões e manipulações de dados
function dateToString(dateString) {
    return dateString.replace(/-/g, '');
}

module.exports = {dateToString};