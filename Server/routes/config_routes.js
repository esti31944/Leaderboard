const indexR = require("./index");
const playersR = require("./players");

exports.routesInit = (app)=>{
    app.use("/",indexR);
    app.use("/players",playersR);
}