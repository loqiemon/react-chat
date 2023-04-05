import React, {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SearchUser from './pages/SearchUser';
import axios from "axios";
import {checkAuthRoute} from './utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import {genAsymKey, decryptWithPrivateKey} from './utils/crypto'



function App() {
  const [user, setUser] = useState(undefined);
  const [keys, setKeys] = useState(undefined);
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // const data = await axios.post(checkAuthRoute);
    const response = await fetch(checkAuthRoute, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-type': 'application/json'}
    })
    let data = await response.json()
    if (!data.success) {
      setUser(undefined)
      navigate("/login");
    } else {
      setUser(data)
      navigate("/");
    }
  }


  return (
    <>
      <Routes>
        <Route path='/register' element={<Register user={user} handleUserSet={setUser} checkAuth={checkAuth} />} />
        {/* <Route path='/register' element={<Register user={user} handleUserSet={handleUserSet} />} /> */}
        <Route path='/login' element={<Login user={user} handleUserSet={setUser} checkAuth={checkAuth}/>} />
        <Route path='/setAvatar' element={<SetAvatar user={user}/>} />
        <Route path='/searchUser' element={<SearchUser user={user}/>} />
        <Route path='/' element={<Chat user={user} handleUserSet={setUser} />} />
      </Routes>
    </>
  )
}

export default App;
