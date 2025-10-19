const express = require("express");
const http = require("http");
const cors = require("cors");
const {config} = require("./config/secret")
const { routesInit } = require("./routes/config_routes");

require("./services/db");

const app = express();

app.use(cors());

app.use(express.json());

routesInit(app)
const server = http.createServer(app);
let port = config.port || 3006;
server.listen(port, ()=>{console.log("Server running on port", port);});