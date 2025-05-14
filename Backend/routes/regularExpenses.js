const express = require('express');
const { getDB } = require('../utils/db');
const { ObjectId } = require('mongodb');

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const newDocument = {
      userID: req.user.userID,
      name: req.body.name,
      amount: req.body.amount,
      frequency: req.body.frequency
    };
    const result = await db.collection("regularExpenses").insertOne(newDocument);
    const insertedDocument = { _id: result.insertedId, ...newDocument };
    res.status(201).send(insertedDocument);
  } catch (error) {
    console.error("Could not add the new regular expense: " + error);
    res.status(500).send("Error adding new regular expense");
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("regularExpenses").find({ userID: req.user.userID }).toArray();
    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Could not find regular expenses: " + error);
    res.status(500).send("Error finding regular expenses");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const updateDoc = await db.collection("regular-expenses").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("Regular expense not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("regular-expenses").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });
    
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("Regular expense not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("Regular expense not found") }
    
    res.status(200).send(updateDoc);
  } catch (error) {
    console.error("Error updating regular expense: " + error);
    res.status(500).send(error);
  } 
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('regularExpenses').deleteOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })

    if (result.deletedCount === 0) { return res.status(404).send("Regular expense not found") }
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  }
})

module.exports = router;