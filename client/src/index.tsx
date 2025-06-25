import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import AuthForm from "./AuthForm";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Set up Apollo Auth Link
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwt");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Simple auth gate
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("jwt");
  return token ? children : <Navigate to="/auth" />;
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
