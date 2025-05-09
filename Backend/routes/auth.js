const express = require('express');
const { client, db } = require('../utils/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, authenticateAccessToken, authenticateRefreshToken } = require('../utils/jwt.js')

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    await client.connect();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newDocument = {
      userID: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: String(req.body.phone),
      theme: "light",
      color: "blue"
    };
    const result = await db.collection("users").insertOne(newDocument);
    res.status(200);
    res.send(result);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).send({
        success: false,
        message: `An account with the ${field === 'phone' ? 'phone number' : field} already exists`,
        field: field
      })
    }
    console.error("Could not add the new User: " + error);
    res.status(500).send("Error adding new User");
  } finally {
    await client.close();
  }
});

router.post("/login", async (req, res) => {
  try {
    await client.connect();
    const query = { email: req.body.email.toLowerCase() };
    const user = await db.collection("users").findOne(query);

    if (!user) {
      return res.status(404).send("User not found");
    }
    try {
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if (correctPassword) {
        const userForToken = { userID: user.userID, email: user.email }
        const accessToken = generateAccessToken(userForToken)
        const refreshToken = generateRefreshToken(userForToken)

        const createdAt = new Date();
        const expiresAt = new Date(Date.now() + (parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000))

        const refreshTokenObject = { token: refreshToken, createdAt: createdAt, expiresAt: expiresAt }

        await db.collection('users').updateOne({ userID: user.userID }, { $set: { refreshToken: refreshTokenObject } })

        return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken })
      }
      res.status(401).send("Incorrect password");
    } catch (error) {
      console.error(error)
      res.status(500).send("internal server error")
    }
  } catch (error) {
    console.error("Could not login: " + error);
    res.status(500).send("Error Logging in");
  } finally {
    await client.close();
  }
})

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) { return res.status(400).send("Refresh token required") }
    await client.connect();

    const result = await db.collection("users").updateOne({ "refreshToken.token": refreshToken }, { $set: { refreshToken: null } });
    if (result.modifiedCount === 0) { return res.status(404).send("Token not found") }

    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Error logging out: " + error);
    res.status(500).send("Internal server error");
  } finally {
    await client.close();
  }
});

router.post("/refresh-token", authenticateRefreshToken, async (req, res) => {
  try {
    const userForToken = { userID: req.user.userID, email: req.user.email };
    console.log(userForToken)
    const accessToken = generateAccessToken(userForToken);

    return res.status(200).send({ accessToken: accessToken });

  } catch (error) {
    console.error("Error refreshing token: " + error);
    res.status(500).send("Internal server error");
  }
});

router.get("/verify", authenticateAccessToken, async (req, res) => {
  try {
    await client.connect();

    const user = await db.collection("users").findOne({ userID: req.user.userID }, { projection: { password: 0, refreshToken: 0, _id: 0 } });

    if (!user) { return res.status(404).send({ valid: false, message: "User not found" }) }
    res.status(200).send({ valid: true, user: user });

  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).send({ valid: false, message: "Internal server error" });

  } finally {
    await client.close();
  }
});

module.exports = router;