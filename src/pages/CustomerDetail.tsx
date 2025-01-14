import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerDetailedDescription from "../components/CustomerDetailedDescription";
// import { Button } from "antd";
import FilterButton from "../components/customComponents/FilterButton";

const CustomerDetail: React.FC = () => {
  const urlParams = useParams();
  const customerID: number = Number(urlParams?.user_id); // Todo: Update to handle missing ID
  const navigate = useNavigate();

  return (
    <>
      <FilterButton
        type="default"
        onClick={() => navigate(-1)}
        customStyle={{ margin: "1em 0" }}
        icon={<i className="fa-solid fa-arrow-left"></i>}
      >
        Back
      </FilterButton>

      <CustomerDetailedDescription customerID={customerID} />
    </>
  );
};

export default CustomerDetail;
