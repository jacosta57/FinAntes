const express = require('express');
const { client, db } = require('../utils/db');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.user.userID,
          name: req.body.name,
          type: req.body.type,
          currentValue: req.body.currentValue,
          purchaseValue: req.body.purchaseValue,
          shares: req.body.shares
        };
        const result = await db.collection("investments").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new Investment: " + error);
        res.status(500);
        res.send("Error adding new Investment");
      } finally {
        await client.close();
      }
});

router.get("/", async (req, res) => {
  try {
      await client.connect();
      const result = await db.collection("investments").find({userID: req.user.userID}).toArray();
      res.status(200);
      res.send(result);
    } catch (error) {
      console.error("Could not find investments: " + error);
      res.status(500);
      res.send("Error finding investments");
    } finally {
      await client.close();
    }
});

module.exports = router;