const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json())

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_NAME;
const db = client.db(dbName);

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`);
  });

app.post("/api/auth/register", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: uuidv4(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          phone: String(req.body.phone),
          theme: "light",
          color: "blue"
          
        };
        const result = await db.collection("users").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {

        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                message: `An account with the ${field === 'phone' ? 'phone number' : field} already exists`,
                field: field
            })
        }

        console.error("Could not add the new User: " + error);
        res.status(500);
        res.send("Error adding new User");
      } finally {
        await client.close();
      }
});

// Budget

app.post("/api/budget", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
          name: req.body.name,
          monthlyBudget: req.body.monthlyBudget,
          currentSpending: req.body.currentSpending,
          alertThreshold: req.body.alertThreshold
        };
        const result = await db.collection("budget").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new budget catgeory: " + error);
        res.status(500);
        res.send("Error adding new budget category");
      } finally {
        await client.close();
      }
});

// Goals

app.post("/api/goals", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
          name: req.body.name,
          targetAmount: req.body.targetAmount,
          currentAmount: req.body.currentAmount,
          targetDate: req.body.targetDate
        };
        const result = await db.collection("goals").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new goal: " + error);
        res.status(500);
        res.send("Error adding new goal");
      } finally {
        await client.close();
      }
});

// Income

app.post("/api/income", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
          name: req.body.name,
          amount: req.body.amount,
          frequency: req.body.frequency
        };
        const result = await db.collection("income").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new income source: " + error);
        res.status(500);
        res.send("Error adding new income source");
      } finally {
        await client.close();
      }
});

// Investments

app.post("/api/investments", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
          name: req.body.name,
          type: req.body.type,
          currentValue: req.body.currentValue,
          purchaseValue: req.body.purchaseValue,
          shares: req.body.shares
        };
        const result = await db.collection("investments").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new Investment: " + error);
        res.status(500);
        res.send("Error adding new Investment");
      } finally {
        await client.close();
      }
});

// Regular Expenses

app.post("/api/regular-expenses", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
          name: req.body.name,
          amount: req.body.amount,
          frequency: req.body.frequency
        };
        const result = await db.collection("regularExpenses").insertOne(newDocument);
        res.status(200);
        res.send(result);
      } catch (error) {
        console.error("Could not add the new regular expense: " + error);
        res.status(500);
        res.send("Error adding new regular expense");
      } finally {
        await client.close();
      }
});

// Upcoming Expenses

app.post("/api/upcoming-expenses", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
          userID: req.body.userID,
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