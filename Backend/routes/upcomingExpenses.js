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

router.put("/:id", async (req, res) => {
  try {
    await client.connect();
    const updateDoc = await db.collection("upcomingExpenses").findOne({ _id: new ObjectId(req.params.id), userID: req.user.userID })
    if (!updateDoc) { return res.status(404).send("upcoming expense not found") }

    for (const [key, value] of Object.entries(req.body)) { updateDoc[key] = value }

    const result = await db.collection("upcomingExpenses").updateOne({ _id: new ObjectId(req.params.id), userID: req.user.userID }, { $set: updateDoc });

    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("upcoming expense not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("upcoming expense not found") }

    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Error updating upcoming expense: " + error);
    res.status(500).send(error);
  } finally {
    await client.close();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection('upcomingExpenses').deleteOne({_id: new ObjectId(req.params.id), userID: req.user.userID})

    if(result.deletedCount === 0){ return res.status(404).send("Upcoming expense not found")}
    res.status(200).send(result)

  } catch (error) {
    console.error(error)
    res.status(500).send("Internal server error: " + error)
  } finally {
    await client.close();
  }
})

module.exports = router;