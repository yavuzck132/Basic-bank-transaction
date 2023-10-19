import React, { useState, useEffect } from "react";
import axios from "axios";
import { MDBInput } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

function Transfer() {
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState(0);
  const [recipentId, setRecipentId] = useState(0);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    let userData = window.localStorage.getItem("userData");
    setLoading(false);
    getUser(JSON.parse(userData).id);
  }, []);

  const getUser = (id) => {
    axios
      .get(`http://localhost:5000/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const transferMoney = () => {
    axios
      .put("http://localhost:5000/api/transferBalance", { userId: user.id, recipientId: recipentId, transferAmount: amount })
      .then((response) => {
        alert(response.data.message);
        getUser(user.id);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  if(loading) return <div>Loading...</div>
  return <>
    <h1>Transfer Page</h1>
    <h2>{"Username: " + user.name}</h2>
    <h2>{"Balance: " + user.balance}</h2>
    <h2>Amount</h2>
    <MDBInput
          wrapperClass="mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          id="form1"
          type="number"
        />
    <h2>To Account</h2>
    <MDBInput
          wrapperClass="mb-2"
          value={recipentId}
          onChange={(e) => setRecipentId(e.target.value)}
          label="To Account"
          id="form1"
          type="number"
        />
      <button onClick={() => transferMoney()}>Transfer</button>
      <button onClick={() => navigate("/")}>Cancel</button>
  </>;
}

export default Transfer;