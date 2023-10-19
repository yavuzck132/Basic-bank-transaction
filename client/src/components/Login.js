import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleLogin = () => {
    axios
      .post("http://localhost:5000/api/login", { email: email, password: password })
      .then((response) => {
        window.localStorage.setItem("userData", JSON.stringify(response.data.user));
        window.location.href = "/"   
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <MDBContainer className="my-2 ">
        <MDBCard>
          <MDBRow className="g-1 d-flex flex-column align-items-center justify-content-center">
            <MDBCol
              md="4"
              className="d-flex align-items-center justify-content-center"
            >
              <MDBCardImage
                src={logo}
                alt="phone"
                className="rounded-t-5 rounded-tr-lg-0"
                fluid
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBCardBody>
                <MDBInput
                  wrapperClass="mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email address"
                  id="form1"
                  type="email"
                />
                <MDBInput
                  wrapperClass="mb-2"
                  value={password}
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="form2"
                  type="password"
                />

                <MDBBtn onClick={handleLogin} className="mb-4 w-100">Log in</MDBBtn>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </form>
  );
}
export default Login;
