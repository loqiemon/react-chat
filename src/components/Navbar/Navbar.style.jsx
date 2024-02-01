import styled from 'styled-components'
import {Link} from "react-router-dom";

export const Nav = styled.nav`
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  padding: 15px;
  background: ${({theme}) => theme.common.greenBack};
  color: ${({theme}) => theme.common.white}
`

export const Header = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: center;
`

export const CustomLink = styled(Link)`
  text-decoration: none;
  color: ${({theme}) => theme.common.white};

  &:hover {
    border-bottom: 2px solid #fff;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
`

export const Nickname = styled.span`
  color: ${({theme}) => theme.common.white};
  //text-align: center;
  font-size: 25px;
  font-weight: 500;
`

export const BreakLine = styled.div`
  width: 115px;
  height: 2px;
  background: ${({theme}) => theme.common.white};
`

export const Switches = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`
