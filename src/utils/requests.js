import { getPublicKeyRoute, getMyChatsRoute, getSomeUsersRoute, getAllFriendsRoute, searchUserRoute } from "./APIRoutes"; 
import {getShardRoute, addTransactionRoute, getBlockchainPublicKeyRoute, addSegmentRoute} from '../utils/APIBlochain';
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



export const getChats = async (sign) => {
  const response = await fetch(getMyChatsRoute, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({'sign': sign})
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


export const getAllFriends = async (chatId) => {
  const response = await fetch(getAllFriendsRoute, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
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


export const addTransaction = async (userId, chatId, msg, symKey, sign, file='None') => {
  console.log(chatId)
  await axios.post(addTransactionRoute, {
    "segment_id": chatId,
    "writer": userId,
    "reader": chatId,
    "message": symEncrypt(msg, symKey),
    "file": file,
    'eds': sign,
    "owner": false,
    "timestamp": ''
  }).then(res => console.log(res))
}


export const getBlockchainPublicKey = async () => {
  const response = await axios.get(getBlockchainPublicKeyRoute)
  return response.pubkey
}


export const postSearchUser = async (sign, searchTerm) => {
  const response = await postRequestCookie(searchUserRoute, {'sign': sign, 'searchInput': searchTerm})
  return response;
}


export const addSegmentBlockchain = async (sign, chatId, skey) => {
  // {
  //   // 'sign': sign,
  //  'segment_id': chatId,
  //   "owner": false,
  //    "timestamp": "", 
  //   //  'skey': skey
  //   }
  const response = await axios.post(addSegmentRoute, 
        {
        "segment_id": chatId,
        "owner": false,
        "timestamp": ""
        }
      )
  return response;
}



