const express = require('express');
const { getDB } = require('../utils/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne({ userID: req.user.userID }, { projection: { password: 0, refreshToken: 0 } });

    if (!user) { return res.status(404).send("User not found"); }

    res.status(200).send(user);
  } catch (error) {
    console.error("Could not find user: " + error);
    res.status(500).send("Error finding user");
  } 
});

router.put("/update", async (req, res) => {
  try {
    const db = getDB();
    const updateDoc = await db.collection("users").findOne({ userID: req.user.userID }, { projection: { password: 0, refreshToken: 0, _id: 0 } })
    if (!updateDoc) { return res.status(404).send("user not found") }
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== 'password' && key !== 'email') { updateDoc[key] = value }
    }
    const result = await db.collection("users").updateOne({ userID: req.user.userID }, { $set: updateDoc }, { returnDocument: 'after' });
    if (result.modifiedCount === 0 && result.acknowledged) { return res.status(304).send("user not changed") }
    else if (result.modifiedCount === 0) { return res.status(404).send("user not found") }
    res.status(200).send(updateDoc);
  } catch (error) {
    console.error("Error updating user: " + error);
    res.status(500).send(error);
  } 
});

router.put("/password", async (req, res) => {
  console.log("Password route started")
  try {
    const db = getDB();

    const user = await db.collection("users").findOne({ userID: req.user.userID });
    if (!user) { return res.status(404).send("User not found") }

    const isCurrentPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isCurrentPasswordValid) { return res.status(401).send("Current password is incorrect") }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    const result = await db.collection("users").updateOne({ userID: req.user.userID }, { $set: { password: hashedPassword } });

    if (result.modifiedCount === 0) { return res.status(500).send("Password update failed") }
    res.status(200).send("Password updated successfully");

  } catch (error) {
    console.error("Error updating password: " + error);
    res.status(500).send("Error updating password");
  } 
});

router.put("/email", async (req, res) => {
  try {
    const db = getDB();

    const user = await db.collection("users").findOne({ userID: req.user.userID });
    if (!user) { return res.status(404).send("User not found") }

    const isCurrentPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isCurrentPasswordValid) { return res.status(401).send("Current password is incorrect") }

    if (!req.body.email) { return res.status(400).send("New email is required") }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) { return res.status(400).send("Invalid email format") }

    const existingUser = await db.collection("users").findOne({ email: req.body.email.toLowerCase(), userID: { $ne: req.user.userID }});

    if (existingUser) { return res.status(409).send("Email already in use") }

    const result = await db.collection("users").updateOne({ userID: req.user.userID }, { $set: { email: req.body.email.toLowerCase() } });

    if (result.modifiedCount === 0) { return res.status(500).send("Email update failed") }
    res.status(200).send("Email updated successfully");

  } catch (error) {
    console.error("Error updating email: " + error);
    res.status(500).send("Error updating email");

  } 
});

module.exports = router;