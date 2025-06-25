import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "./styles/AuthForm.css"; 

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN);
  const [register] = useMutation(REGISTER);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const mutation = isLogin ? login : register;
    const { data } = await mutation({ variables: { email, password } });

    console.log("Auth response data:", data);

    const payload = isLogin ? data?.login : data?.register;

    if (!payload || !payload.token) {
      throw new Error("Authentication failed: no token received");
    }

    localStorage.setItem("jwt", payload.token);
    navigate("/"); // redirect to dashboard
  } catch (err: any) {
    alert(err.message || "Authentication failed");
    console.error(err);
  }
};

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", margin: "1rem auto", padding: "0.5rem", width: "100%" }}
        />
        <input className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "Need an account?" : "Already have an account?"}
        <button className="auth-submit"
          style={{ marginLeft: "0.5rem" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
