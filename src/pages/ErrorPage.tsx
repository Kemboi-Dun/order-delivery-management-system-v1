import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>ErrorPage</h1>
      <Button type="primary" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
};

export default ErrorPage;
