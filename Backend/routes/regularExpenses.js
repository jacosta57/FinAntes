const express = require('express');
const { client, db } = require('../utils/db');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.user.userID,
          name: req.body.name,
          amount: req.body.amount,
          frequency: req.body.frequency
        };
        const result = await db.collection("regularExpenses").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new regular expense: " + error);
        res.status(500);
        res.send("Error adding new regular expense");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
  try {
      await client.connect();
      const result = await db.collection("regularExpenses").find({userID: req.user.userID}).toArray();
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error("Could not find regular expenses: " + error);
      res.status(500);
      res.send("Error finding regular expenses");
    } finally {
      await client.close();
    }
});

module.exports = router;