
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {searchUserRoute} from '../utils/APIRoutes';
import axios from 'axios';


const SearchUser = (props) => {
  const navigate = useNavigate()
  // console.log('chat', props.user)
  if (!props.user) {
    navigate('/login')
  }


  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    console.log(searchTerm)
    const data = await axios.post(`${searchUserRoute}`, {
      searchInput: searchTerm
    })
    setSearchResults(data)
  };

  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
      <SearchUserWrapper>
        <SearchPageContainer>
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Enter user name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>
              <FaSearch />
            </SearchButton>
          </SearchBarContainer>
          <UsersList>
            {searchResults.length > 0 ? searchResults.map((user) => (
              <UserItem key={user._id}>
                <UserName>{user.nickname}</UserName>
                <UserEmail>{user.avatarImage}</UserEmail>
              </UserItem>
            )) : <h2>Нет подходящих пользователей</h2>}
          </UsersList>
        </SearchPageContainer>
      </SearchUserWrapper>
    </>
  );
};

export default SearchUser;

const SearchUserWrapper = styled.div`
  padding-top: 60px;
`;


const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 10px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-bottom-color: #2ecc71;
  }
`;

const SearchButton = styled.button`
  border: none;
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
`;

const UsersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 500px;
`;

const UserItem = styled.li`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 14px;
`;

