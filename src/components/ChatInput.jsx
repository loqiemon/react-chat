import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from '@mui/material/IconButton';



export default function ChatInput(props) {
  const [msg, setMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      props.sendMessage(msg)
      setMsg("");
    }
  };


  const handleAttachFile = async (event) => {
    setSelectedFile(event.target.files[0]);
  }



  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker &&<Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <div className="pin">
        <div>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-file"
            type="file"
            onChange={handleAttachFile}
          />
          <label htmlFor="upload-file">
            <IconButton color="primary" component="span">
              <AttachFileIcon/>
            </IconButton>
      </label>
    </div>
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Сообщение..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  // display: grid;
  align-items: center;
  // grid-template-columns: 7% 92%;
  // background-color: #080420;
  background-color: rgba(119, 119, 119, 0.3);
  border-radius: 1.2rem;
  display: flex;
  padding: 0 2rem;
  width: 100%;
  height: 6rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .pin {
      svg {
        color: black;
      }
    }
    .emoji {
      width: 1rem;
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 95%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    // gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      // height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;  
      align-self: center;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      width: 10%;
      height: 3rem;
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  .EmojiPickerReact {
    height: 25rem;
    width: 350px;
    margin-top: -33rem;
  }
`;