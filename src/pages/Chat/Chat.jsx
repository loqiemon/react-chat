import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import ChatListWithSearch from '../../components/ChatListWithSearch/ChatListWithSearch'


export default function Chat (props) {
  const [selectedChat, setSelectedChat] = useState(undefined);


  const navigate = useNavigate()
  useEffect(() => {
    if (!props.user) {
      navigate('/login')
    }
  }, [props.user])



  return (
    <>
      {
        props.user ? <>
        <Navbar user={props.user}/>
        <ChatListWithSearch />
        </> : <Loader/>
      }
    </>
  )
}