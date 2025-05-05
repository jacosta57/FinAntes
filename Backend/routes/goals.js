const express = require('express');
const { client, db } = require('../utils/db');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.user.userID,
          name: req.body.name,
          targetAmount: req.body.targetAmount,
          currentAmount: req.body.currentAmount,
          targetDate: req.body.targetDate
        };
        const result = await db.collection("goals").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new goal: " + error);
        res.status(500);
        res.send("Error adding new goal");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
  try {
      await client.connect();
      const result = await db.collection("goals").find({userID: req.user.userID}).toArray();
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error("Could not find goals: " + error);
      res.status(500);
      res.send("Error finding goals");
    } finally {
      await client.close();
    }
});

module.exports = router;