import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="Error"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default ErrorPage;
