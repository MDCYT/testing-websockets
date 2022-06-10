// importamos las librerías requeridas
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const WebSocketServer = require("websocket").server;

// Creamos el servidor de sockets y lo incorporamos al servidor de la aplicación
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

// Especificamos el puerto en una varibale port, incorporamos cors, express
// y la ruta a los archivo estáticos (la carpeta public)
app.set("port", 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// Cuando llega un request por sockets validamos el origen
// En caso de origen permitido, recibimos el mensaje y lo mandamos
// de regreso al
wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  console.log("Connection accepted");
  connection.on("message", (message) => {
    console.log("Mensaje recibido: " + message.utf8Data);
    connection.sendUTF("Recibido: " + message.utf8Data);
  });
  connection.on("close", (reasonCode, description) => {
    console.log("El cliente se desconecto");
  });
});

// Iniciamos el servidor en el puerto establecido por la variable port (3000)
server.listen(app.get("port"), () => {
  console.log("Servidor iniciado en el puerto: " + app.get("port"));
});
