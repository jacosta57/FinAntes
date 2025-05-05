const express = require('express');
const { client, db } = require('../utils/db');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        await client.connect();
        const result = await db.collection("users").find({userID: req.user.userID});
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not find user: " + error);
        res.status(500);
        res.send("Error finding user");
      } finally {
        await client.close();
      }
});

module.exports = router;