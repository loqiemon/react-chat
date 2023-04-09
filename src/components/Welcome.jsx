import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import Robot from "../assets/robot.gif";
export default function Welcome() {
  return (
    <Container>
      {/* <img src={Robot} alt="" /> */}
      <h3>Выберите чат</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // color: white;
  color: white;
  flex-direction: column;
  align-self:center;
  justify-self:center;
  img {
    height: 20rem;
  }
  border-radius: 1.3rem;
  span {
    // color: #4e0eff;
    color: #79C7C5;
  }
  margin: 0 auto;
`;