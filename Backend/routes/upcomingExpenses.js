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
          dueDate: req.body.dueDate,
          isRecurring: req.body.isRecurring
        };
        const result = await db.collection("upcomingExpenses").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new upcoming expense: " + error);
        res.status(500);
        res.send("Error adding new upcoming expense");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
  try {
      await client.connect();
      const result = await db.collection("upcomingExpenses").find({userID: req.user.userID}).toArray();
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error("Could not find upcoming expenses: " + error);
      res.status(500);
      res.send("Error finding upcoming expenses");
    } finally {
      await client.close();
    }
});

module.exports = router;