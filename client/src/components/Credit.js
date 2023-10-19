
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MDBListGroup, MDBListGroupItem, MDBBtn} from "mdb-react-ui-kit";


function Credit() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/usersExceededCreditLimit", { params: { page: 1 } })
      .then((response) => {
        setPages(response.data.totalPage)
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [page]);

  const getColor = (totalBalance) => {
    if(totalBalance >= 0){
      return 'green';
    }else if(totalBalance < 0){
      return 'red';
    }else{
      return 'black';
    }
  }
  if(loading) return <div>Loading...</div>
  return (
    <>
      <h1>Credit Page</h1>
      <strong>Name   -  Limit   -   Balance</strong>
      <MDBListGroup>
        {users.data.map((user) => (
          <MDBListGroupItem key={user.id} style={{color: getColor(user.balance)}}>
            <strong >{user.name}</strong> - <span >{user.limit} - {user.balance}</span>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
      <MDBBtn disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</MDBBtn>
      <span>{page}/{pages}</span>
      <MDBBtn disabled={page === pages} onClick={() => setPage(page + 1)}>Next</MDBBtn>
    </>
  );
}

export default Credit;
