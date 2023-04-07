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
import {genAsymKeys, asymDecrypt, symDecrypt, asymEncrypt} from './utils/crypto'
import {postRequestCookie} from './utils/requests'


function App() {
  const [user, setUser] = useState(undefined);
  const [serverKeys, setServerKeys] = useState(undefined);
  const [clientKey, setClientKeys] = useState(undefined);
  const [privKey, setPrivKey] = useState(undefined);
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const func = async () => {
      // const data = await axios.post(checkAuthRoute);
      const data = await postRequestCookie(checkAuthRoute, {publicKey: clientKey.publicKey})
      console.log(data, 'data.privateKey')
      if (!data.success) {
        setUser(undefined)
        navigate("/login");
      } else {
        setUser(data)
        // setPrivKey(asymDecrypt(data.privateKey, clientKey.privateKey))
        // const e = asymEncrypt('122121', clientKey.publicKey)
        // console.log(e, 'eeeeeeeeeee')
        // const ee = asymDecrypt(e, clientKey.privateKey)
        // console.log(ee, 'вфв')
        // console.log(data.encrypteIv, 'data.encrypteIv')
  
        // const iv = asymDecrypt(data.encrypteIv, clientKey.privateKey)
        const symKey = asymDecrypt(data.encryptedSymKey, clientKey.privateKey)
        console.log(symKey, 'decripted symKey')
        setPrivKey(symDecrypt(data.privateKey, symKey))
        navigate("/");
      }
    }
    func()
  }, [clientKey]);

  const checkAuth = async () => {
    const asymKeys = genAsymKeys()
    setClientKeys(asymKeys)
    console.log(asymKeys, 'asymKeys')
  }


  return (
    <>
      <Routes>
        <Route path='/register' element={<Register user={user} handleUserSet={setUser} checkAuth={checkAuth} />} />
        {/* <Route path='/register' element={<Register user={user} handleUserSet={handleUserSet} />} /> */}
        <Route path='/login' element={<Login user={user} handleUserSet={setUser} checkAuth={checkAuth}/>} />
        <Route path='/setAvatar' element={<SetAvatar user={user}/>} />
        <Route path='/searchUser' element={<SearchUser user={user}/>} />
        <Route path='/' element={<Chat user={user} handleUserSet={setUser} privKey={privKey} />} />
      </Routes>
    </>
  )
}

export default App;
