import React , {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Chat(props) {
  const navigate = useNavigate()

  if (!props.user ){
      navigate('/login')
  }

  useEffect(() => {
    const func = async () => {
      if (props.user) {
        if (props.user.image) {
          //get chats
        } else {
          navigate("/setAvatar");
        }
      }
    }
    func();
  }, [props.user]);

  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
    </>
  )
}

export default Chat
