import React, { useState, useEffect } from "react";
import axios from "axios";
import { MDBListGroup, MDBListGroupItem, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

function Home() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1)
  const navigate = useNavigate();

  useEffect(() => {
    let userData = window.localStorage.getItem("userData");
    if(userData){
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  const getData = () => {
    if(name === ""){
      getAllData();
    }else{
      getDataByName();
    }
  }

  const getAllData = () =>{
    axios
      .get("http://localhost:5000/api/users", { params: { page: page } })
      .then((response) => {
        setUsers(response.data.data);
        setPages(response.data.pages)
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const getDataByName = () => {
    axios
      .get("http://localhost:5000/api/findUsersByName", { params: { name: name } })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/logout", { userId: currentUser.id })
      .then((response) => {
        window.localStorage.removeItem("userData");
        navigate(0);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  return (
    <div style={{margin:"50px"}}>
      {currentUser ? <div>
        <h2>Hello: {currentUser.name}</h2>
        <button onClick={handleLogout}>Logout</button> 
      </div> : <></>}
      <h2>Hello: </h2>
      <h2>Search By Name</h2>
      <MDBInput
          wrapperClass="mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Search By Name"
          id="form1"
          type="text"
        />
        <button onClick={getData}>Search</button>
      <h2>User List</h2>
      <MDBListGroup>
        {users.map((user) => (
          <MDBListGroupItem key={user.id}>
            <strong>{user.name}</strong> - {user.email} - {user.country}
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
      <MDBBtn disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</MDBBtn>
      <span>{page}/{pages}</span>
      <MDBBtn disabled={page === pages} onClick={() => setPage(page + 1)}>Next</MDBBtn>
    </div>
  );
}

export default Home;
