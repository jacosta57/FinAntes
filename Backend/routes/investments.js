const express = require('express');
const { client, db } = require('../utils/db');
const { ObjectId } = require('mongodb');

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

router.put("/:id", async (req, res) => {
  try {
    await client.connect();
    const updateDoc = await db.collection("investments").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("investment not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("investments").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });

    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("investment not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("investment not found") }

    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Error updating investment: " + error);
    res.status(500).send(error);
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection('investments').deleteOne({_id: new ObjectId(req.params.id), userID: req.user.userID})

    if(result.deletedCount === 0){ return res.status(404).send("Investment not found")}
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  } finally {
    await client.close();
  }
})

module.exports = router;