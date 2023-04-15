import { getPublicKeyRoute, getMyChatsRoute, getSomeUsersRoute } from "./APIRoutes"; 
import {getShardRoute, addTransactionRoute} from '../utils/APIBlochain';
import { symEncrypt } from "./crypto";
import axios from 'axios'

export const postRequestCookie = async (url, data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
    const responseJson = await response.json();
    return responseJson;
}

export const getRequestCookie = async (url) => {
    const response = await fetch(url, {credentials: 'include'})
    const responseJson = await response.json();
    return responseJson;
}


export const getPublicKey = async (userId) => {
  const response = await fetch(getPublicKeyRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({'userId': userId})
  })
const responseJson = await response.json();
return responseJson;
}



export const getChats = async () => {
  const response = await fetch(getMyChatsRoute, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
  const responseJson = await response.json();
  return responseJson;
}


export const getSomeUsers = async (chatId) => {
  const response = await fetch(getSomeUsersRoute, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({'chatId': chatId})
  })
  const responseJson = await response.json();
  return responseJson;
}


export const getMessages = async (chatId) => {
  const data = await axios.post(getShardRoute, {
    "segment_id": chatId,
    "numShard": "-1",
    "convertMessages": true
  })

  let chatData = [];
  const shardCount = data.data.listShards.length;

  for (let i = 0; i < shardCount; i++) {
    for (let j = 0; j < data.data.listShards[i].length; j++) {
      const response = await axios.post(getShardRoute, {
        "segment_id": chatId,
        "numShard": j,
        "convertMessages": true
      })
      chatData = [...chatData, ...response.data]
    }
  }
  return chatData
}


export const addTransaction = async (userId, chatId, msg, symKey) => {
  await axios.post(addTransactionRoute, {
    "segment_id": chatId,
    "writer": userId,
    "reader": chatId,
    "message": symEncrypt(msg, symKey),
    "file": 'None'
  }).then(res => console.log(res))
}
