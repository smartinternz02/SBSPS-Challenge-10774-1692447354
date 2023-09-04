import React from "react";
import Card from "../Card/Card";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import {CDBInput,CDBCard, CDBCardBody, CDBBtn, CDBLink, CDBContainer, CDBSelect} from 'cdbreact';
import "./QueryItem.css";


export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
   
  }
`;


function QueryItem({ date, id }) {
  date = new Date(date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  console.log("qi : ", date, day, month, year, id);
  return (
    <li>
      <Card className="query-item">
        <div className="query-item__description">
          <h2>
            Analysis - {id} - {`${day}/${month}/${year}`}
          </h2>
          <NavLink to={`/history/${id}`}>
          <CDBBtn color="dark" outline className="btn-block my-3 mx-0">
            View Details
        </CDBBtn>
          </NavLink>
        </div>
      </Card>
    </li>
  );
}

export default QueryItem;
