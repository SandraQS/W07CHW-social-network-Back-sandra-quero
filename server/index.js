const cors = require("cors");
const morgan = require("morgan");
const debug = require("debug")("social-networks:server");
const express = require("express");
const chalk = require("chalk");
const usersRoutes = require("./routes/usersRoutes");
const profileRoutes = require("./routes/profileRoutes");
const {
  handlerNotFound,
  handlerGeneralError,
} = require("./middlewares/errors");

const app = express();

const initServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Escuchando en el puerto ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("Error al iniciar el servidor"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`El puerto ${port} está ocupado`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellow("El servidor express se ha desconectado"));
    });
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/profile", profileRoutes);

app.use(handlerNotFound);
app.use(handlerGeneralError);

module.exports = { initServer, app };
