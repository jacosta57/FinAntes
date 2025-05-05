const express = require('express');
const router = express.Router();
const { client, db } = require('../utils/db');

router.post("/", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.user.userID,
          name: req.body.name,
          amount: req.body.amount,
          frequency: req.body.frequency
        };
        const result = await db.collection("income").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new income source: " + error);
        res.status(500);
        res.send("Error adding new income source");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
  try {
      await client.connect();
      const result = await db.collection("income").find({userID: req.user.userID}).toArray();
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error("Could not find income sources: " + error);
      res.status(500);
      res.send("Error finding income");
    } finally {
      await client.close();
    }
});

module.exports = router;