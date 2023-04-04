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
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;