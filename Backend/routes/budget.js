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
    const result = await db.collection("budget").find({ userID: req.user.userID }).toArray();
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

router.put("/:id", async (req, res) => {
  try {
    await client.connect();
    const updateDoc = await db.collection("budget").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("Budget category not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("budget").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });
    
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("Budget category not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("Budget category not found") }
    
    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Error updating budget category: " + error);
    res.status(500).send(error);
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection('budget').deleteOne({_id: new ObjectId(req.params.id), userID: req.user.userID})

    if(result.deletedCount === 0){ return res.status(404).send("Budget category not found")}
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  } finally {
    await client.close();
  }
})

module.exports = router;