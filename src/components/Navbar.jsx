import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import Logout from "./Logout";
import { useNavigate, Link} from 'react-router-dom';

export default function Navbar(props) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    if (!props.user)
      navigate("/login");
  }, [navigate]);


  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  
  return (
    <Nav>
      <Brand>
        <h3>WebChat</h3>
      </Brand>
      <Hamburger onClick={toggleNav}>
        <div></div>
        <div></div>
        <div></div>
      </Hamburger>
      <NavLinks isNavOpen={isNavOpen}>
        <CustomLink to="/searchUser">Поиск</CustomLink>
        <NavLink href="#">About</NavLink>
        <NavLink href="#">Contact</NavLink>
        <div className="current-user">
          <div className="avatar">
            {props.user.image ?
                        <img
                          src={`data:image/svg+xml;base64,${props.user.image}`}
                          alt=""
                        /> : <></>
                      }
            </div>
            <div className="username">
              <h2>{props.user.nickname}</h2>
            </div>
        </div>
        <Logout handleUserSet={props.handleUserSet}/>
      </NavLinks>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0d0d30;
  color: #fff;
  padding: 1rem;
  position: fixed;
  
  z-index: 10;
    width: 100vw;
  @media screen and (max-width: 768px) {
    padding: 0.5rem;
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 2.5rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

const Brand = styled.div`
  h3 {
    margin: 0;
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 1.5rem;
    height: 1.5rem;
    div {
      width: 100%;
      height: 0.25rem;
      background-color: #fff;
      border-radius: 0.125rem;
      transition: all 0.3s ease;
      transform-origin: 1px;
    }
    div:first-child {
      transform: ${({ isNavOpen }) =>
    isNavOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }
    div:nth-child(2) {
      opacity: ${({ isNavOpen }) => (isNavOpen ? '0' : '1')};
    }
    div:nth-child(3) {
      transform: ${({ isNavOpen }) =>
    isNavOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #0d0d30;
    text-align: center;
    max-height: ${({ isNavOpen }) => (isNavOpen ? '500px' : '0')};
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 1;
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  padding: 0.5rem;
  margin-right: 1rem;

  &:hover {
    border-bottom: 2px solid #fff;
  }

  @media screen and (max-width: 768px) {
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #fff;
  padding: 0.5rem;
  margin-right: 1rem;

  &:hover {
    border-bottom: 2px solid #fff;
  }

  @media screen and (max-width: 768px) {
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }
`;
