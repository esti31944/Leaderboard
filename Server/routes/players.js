const express = require("express");
const {PlayerModel} = require("../models/playerModel")

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({msg:"Players work"})
})


// הוספת שחקן חדש
router.post("/", async (req, res) => {
    try {
      const { name, imgUrl, score } = req.body;
      const player = new PlayerModel({ name, imgUrl, score });
      await player.save();
      res.status(201).json(player);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  });
  
  // עדכון ניקוד
  router.put("/score/:id", async (req, res) => {
    try {
      const { score } = req.body;
      const player = await PlayerModel.findByIdAndUpdate(
        req.params.id,
        { score },
        { new: true }
      );
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  });
  
  // שליפת TOP N
  router.get("/top/:n", async (req, res) => {
    try {
      const n = parseInt(req.params.n) || 10;
      const topPlayers = await PlayerModel.find()
        .sort({ score: -1 }) // מהגבוה לנמוך
        .limit(n)
        .select("name imgUrl score");
      res.json(topPlayers);
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  });
  
  // שליפת שחקן + 5 מעליו ו־5 מתחתיו
  router.get("/around/:id", async (req, res) => {
    try {
      const player = await PlayerModel.findById(req.params.id);
      if (!player) return res.status(404).json({ error: "Player not found" });
  
      const allPlayers = await PlayerModel.find()
        .sort({ score: -1 })
        .select("name imgUrl score");
  
      const index = allPlayers.findIndex(p => p._id.equals(player._id));
      if (index === -1) return res.status(404).json({ error: "Player not found" });
  
      const start = Math.max(0, index - 5);
      const end = Math.min(allPlayers.length, index + 6);
  
      const neighborhood = allPlayers.slice(start, end);
  
      res.json({
        rank: index + 1,
        player,
        neighborhood
      });
    } catch (err) {
      res.status(500).json({ error: "Server error", details: err });
    }
  });

  // קבלת N עם הניקוד הנמוך ביותר
router.get('/bottom/:n', async (req, res) => {
  try {
    const n = Math.min(parseInt(req.params.n, 10) || 3, 1000);
    const bottomPlayers = await PlayerModel.find()
      .sort({ score: 1 }) // נמוך -> גבוה
      .limit(n)
      .select('name imgUrl score');
    res.json(bottomPlayers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err });
  }
});

// מחיקת שחקן לפי ID
router.delete("/:id", async (req, res) => {
  try {
    const player = await PlayerModel.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json({ msg: "Player deleted", player });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
});


module.exports = router;