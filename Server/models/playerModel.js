const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name:String,
  imgUrl:String,
  score:Number
});

exports.PlayerModel = mongoose.model("players",playerSchema);
