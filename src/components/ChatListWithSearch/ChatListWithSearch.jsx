import React, { useState, useEffect } from 'react';

import './chatlist.scss'


const ChatListWithSearch = (props) => {

  return (
    <>
      <div className="chatlist">
        <div className="chatlist_item">
          <div className="chatlist_item_image"></div>
          <div className="chatlist_item_name"></div>
        </div>
      </div>
    </>
  );
};


export default ChatListWithSearch;
