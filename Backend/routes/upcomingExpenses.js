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
      dueDate: req.body.dueDate,
      isRecurring: req.body.isRecurring
    };
    const result = await db.collection("upcomingExpenses").insertOne(newDocument);
    const insertedDocument = { _id: result.insertedId, ...newDocument };
    res.status(201).send(insertedDocument);
  } catch (error) {
    console.error("Could not add the new upcoming expense: " + error);
    res.status(500).send("Error adding new upcoming expense");
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("upcomingExpenses").find({ userID: req.user.userID }).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Could not find upcoming expenses: " + error);
    res.status(500).send("Error finding upcoming expenses");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const updateDoc = await db.collection("upcoming-expenses").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("Upcoming expense not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("upcoming-expenses").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });
    
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("Upcoming expense not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("Upcoming expense not found") }
    
    res.status(200).send(updateDoc);
  } catch (error) {
    console.error("Error updating upcoming expense: " + error);
    res.status(500).send(error);
  } 
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('upcomingExpenses').deleteOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })

    if (result.deletedCount === 0) { return res.status(404).send("Upcoming expense not found") }
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  }
})

module.exports = router;