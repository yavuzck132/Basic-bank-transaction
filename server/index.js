const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const fs = require("fs");
const { waitForDebugger } = require("inspector");

let users = [];
let transactions = [];
let creditByCountry = [];

fs.readFile("user.json", (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
  calculateCreditByCountry();
});

fs.readFile("user-transaction.json", (err, data) => {
  if (err) throw err;
  transactions = JSON.parse(data);
  updateUserBalances();
});

const calculateCreditByCountry = () => {
  let user;
  users.forEach((value) => {
    user = creditByCountry.find((element) => element.country === value.country);
    if(user){
      user.limit = user.limit + value.limit;
    }else{
      creditByCountry.push({country: value.country, limit: value.limit})
    }
  })
}

const updateUserBalances = () => {
  transactions.forEach((value) => {
    let senderIndex;
    let recipientIndex;
    senderIndex = users.findIndex((element) => value.senderId === element.id);
    if(users[senderIndex].balance !== undefined){
      users[senderIndex].balance = users[senderIndex].balance - value.amount;
      recipientIndex = users.findIndex((element) => value.recipientId === element.id);
      users[recipientIndex].balance = users[recipientIndex].balance - value.amount;
    }
  })
}

app.get("/api/users", (req, res) => {
  const page = req.query.page;
  res.json({pages: Math.ceil(users.length / 20), data: users.slice(+page - 1, +page + 19)});  
});

app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    let user = users.find((value) => value.id == id)
    res.json(user);
});

app.get('/api/findUsersByName', (req, res) => {
  const name = req.query.name;
  let usersByName = users.filter((element) => element.name == name)
  res.json(usersByName);
});

app.get('/api/creditByCountry', (req, res) => {
  res.json(creditByCountry);
});

app.get('/api/usersExceededCreditLimit', (req, res) => {
  const page = req.query.page;
  res.json({totalPage: Math.ceil(users.length / 20), data: users.slice(+page - 1, +page + 19)});
});

app.put('/api/transferBalance', (req, res) => {
  const userId = +req.body.userId;
  const recipientId = +req.body.recipientId;
  const transferAmount = +req.body.transferAmount;

  if(userId){
    let user = users.find((value) => value.id == userId);
    if(user.limit + user.balance - transferAmount < 0){
      res
      .status(401)
      .json({ success: false, message: "Transfer exceeds limit" });
    }else{      
      const userIndex = users.findIndex((value) => value.id === user.id);
      const recipentUser = users.find((value) => value.id == recipientId);
      const recipientIndex = users.findIndex((value) => value.id === recipentUser.id);
      user.balance = user.balance - transferAmount;
      users[userIndex] = user;
      recipentUser.balance = recipentUser.balance + transferAmount;
      users[recipientIndex] = recipentUser;
      res.json({ success: true, message: "Transfer succeeded! New balance is: " +  user.balance});
    }    
  }else{
    res
      .status(401)
      .json({ success: false, message: "Authentication Failed" });
  }
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user: user });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Yanlış email veya şifre" });
  }
});

app.post("/api/logout", (req, res) => {
  const userId = req.body.userId;
  const user = users.find((u) => u.id == userId);
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

