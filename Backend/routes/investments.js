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
      type: req.body.type,
      currentValue: req.body.currentValue,
      purchaseValue: req.body.purchaseValue,
      shares: req.body.shares
    };
    const result = await db.collection("investments").insertOne(newDocument)
    const insertedDocument = { _id: result.insertedId, ...newDocument };
    res.status(201).send(insertedDocument);
  } catch (error) {
    console.error("Could not add the new Investment: " + error);
    res.status(500).send("Error adding new Investment");
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("investments").find({ userID: req.user.userID }).toArray();
    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Could not find investments: " + error);
    res.status(500).send("Error finding investments");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const updateDoc = await db.collection("investments").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("Investment not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("investments").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });
    
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("Investment not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("Investment not found") }
    
    res.status(200).send(updateDoc);
  } catch (error) {
    console.error("Error updating investment: " + error);
    res.status(500).send(error);
  } 
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('investments').deleteOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })

    if (result.deletedCount === 0) { return res.status(404).send("Investment not found") }
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  }
})

module.exports = router;