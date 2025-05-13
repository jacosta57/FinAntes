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
      monthlyBudget: req.body.monthlyBudget,
      currentSpending: req.body.currentSpending,
      alertThreshold: req.body.alertThreshold
    };
    const result = await db.collection("budget").insertOne(newDocument);
    const insertedDocument = { _id: result.insertedId, ...newDocument };
    res.status(201).send(insertedDocument);
  } catch (error) {
    console.error("Could not add the new budget catgeory: " + error);
    res.status(500).send("Error adding new budget category");
  } 
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("budget").find({ userID: req.user.userID }).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Could not find budget category: " + error);
    res.status(500).send("Error finding budget category");
  } 
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const updateDoc = await db.collection("budget").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("Budget category not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("budget").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });
    
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("Budget category not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("Budget category not found") }
    
    res.status(200).send(updateDoc);
  } catch (error) {
    console.error("Error updating budget category: " + error);
    res.status(500).send(error);
  } 
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('budget').deleteOne({_id: new ObjectId(req.params.id), userID: req.user.userID})

    if(result.deletedCount === 0){ return res.status(404).send("Budget category not found")}
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  } 
})

module.exports = router;