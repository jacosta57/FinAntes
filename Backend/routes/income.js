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

router.put("/:id", async (req, res) => {
  try {
    await client.connect();
    const updateDoc = await db.collection("income").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("income source not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("income").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });

    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("income source not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("income source not found") }

    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Error updating income source: " + error);
    res.status(500).send(error);
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection('income').deleteOne({_id: new ObjectId(req.params.id), userID: req.user.userID})

    if(result.deletedCount === 0){ return res.status(404).send("Income source not found")}
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  } finally {
    await client.close();
  }
})

module.exports = router;