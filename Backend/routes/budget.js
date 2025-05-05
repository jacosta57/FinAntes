const express = require('express');
const router = express.Router();
const { client, db } = require('../utils/db');
const {authenticateAccessToken} = require('../utils/jwt.js');

router.post("/", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.budget.userID,
          name: req.body.name,
          monthlyBudget: req.body.monthlyBudget,
          currentSpending: req.body.currentSpending,
          alertThreshold: req.body.alertThreshold
        };
        const result = await db.collection("budget").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new budget catgeory: " + error);
        res.status(500);
        res.send("Error adding new budget category");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
    try {
        await client.connect();
        const result = await db.collection("budget").find({userID: req.user.userID}).toArray();
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not find budget category: " + error);
        res.status(500);
        res.send("Error finding budget category");
      } finally {
        await client.close();
      }
});

module.exports = router;