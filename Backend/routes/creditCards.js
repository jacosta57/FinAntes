const express = require('express');
const { client, db } = require('../utils/db');
const { ObjectId } = require('mongodb');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {company} = req.query;

    const filter = company ? { company: company } : {};
    
    await client.connect();
    const result = await db.collection("creditCards").find(filter).toArray();
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