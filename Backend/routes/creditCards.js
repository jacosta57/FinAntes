const express = require('express');
const { getDB } = require('../utils/db');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const {company} = req.query;
    const filter = company ? { company: company } : {};
    
    const result = await db.collection("creditCards").find(filter).toArray();
    res.status(200);
    res.send(result);
  } catch (error) {
    console.error("Could not find budget category: " + error);
    res.status(500);
    res.send("Error finding budget category");
  } 
});

module.exports = router;