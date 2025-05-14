const express = require("express");
const { getDB } = require('../utils/db');
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken, authenticateAccessToken, authenticateRefreshToken } = require("../utils/jwt.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const db = getDB();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newDocument = {
      userID: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: String(req.body.phone),
      theme: "light",
      color: "blue",
    };
    const userForToken = {
      userID: newDocument.userID,
      email: newDocument.email,
    };
    const accessToken = generateAccessToken(userForToken);
    const refreshToken = generateRefreshToken(userForToken);

    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000);

    const refreshTokenObject = {
      token: refreshToken,
      createdAt: createdAt,
      expiresAt: expiresAt,
    };

    newDocument.refreshTokens = [refreshTokenObject];

    const result = await db.collection("users").insertOne(newDocument);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES_IN) * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge:
        parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    });

    res.status(200).send(result);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).send({
        success: false,
        message: `An account with the ${field === "phone" ? "phone number" : field} already exists`, field: field,
      });
    }
    console.error("Could not add the new User: " + error);
    res.status(500).send("Error adding new User");
  } 
});

router.post("/login", async (req, res) => {
  console.log('Login Route Started')
  try {
    const db = getDB();
    const query = { email: req.body.email.toLowerCase() };
    const user = await db.collection("users").findOne(query);

    if (!user) {
      return res.status(404).send("User not found");
    }
    try {
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if (correctPassword) {
        const userForToken = { userID: user.userID, email: user.email };
        const accessToken = generateAccessToken(userForToken);
        const refreshToken = generateRefreshToken(userForToken);

        const createdAt = new Date();
        const expiresAt = new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000);

        const refreshTokenObject = {
          token: refreshToken,
          createdAt: createdAt,
          expiresAt: expiresAt,
        };

        const result = await db.collection("users").updateOne({ userID: user.userID }, { $push: { refreshTokens: refreshTokenObject } });
        if (result.modifiedCount === 0) { return res.status(404).send("User not found") }

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES_IN) * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({ success: true, message: "Login successful" });
      }
      res.status(401).send("Incorrect password");
    } catch (error) {
      console.error(error);
      res.status(500).send("internal server error");
    }
  } catch (error) {
    console.error("Could not login: " + error);
    res.status(500).send("Error Logging in");
  } 
});

router.post("/logout", async (req, res) => {
  console.log('Logout Route Started')
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) { return res.status(400).send("Refresh token required") }
    const db = getDB();

    const result = await db.collection("users").updateOne({ "refreshTokens.token": refreshToken }, { $pull: { refreshTokens: { token: refreshToken } } });
    if (result.modifiedCount === 0) { return res.status(404).send("Token not found") }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.error("Error logging out: " + error);
    res.status(500).send("Internal server error");
  } 
});

router.post("/refresh-token", authenticateRefreshToken, async (req, res) => {
  try {
    const userForToken = { userID: req.user.userID, email: req.user.email };
    const accessToken = generateAccessToken(userForToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES_IN) * 60 * 1000,
    });

    return res.status(200).send({ accessToken: accessToken });
  } catch (error) {
    console.error("Error refreshing token: " + error);
    res.status(500).send("Internal server error");
  }
});

router.get("/verify", authenticateAccessToken, async (req, res) => {
  try {
    const db = getDB();

    const user = await db
      .collection("users")
      .findOne(
        { userID: req.user.userID },
        { projection: { password: 0, refreshTokens: 0, _id: 0 } }
      );

    if (!user) {
      return res.status(404).send({ valid: false, message: "User not found" });
    }
    res.status(200).send({ valid: true, user: user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).send({ valid: false, message: "Internal server error" });
  } 
});

module.exports = router;
