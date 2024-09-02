const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const searchContractsRouter = require("./routes/searchContracts");

const app = express();

// Configura a aplicação para usar o diretório views como a pasta para buscar os arquivos de visualização na pasta views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // Define que sera usado EJS para visualização

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", searchContractsRouter);

// Configura a aplicação para sempre lançar o status code 404 para quando um recurso nao for encontrado
app.use(function (req, res, next) {
  next(createError(404));
});

// Define um manipulador de erro global para aplicação
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
