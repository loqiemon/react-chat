import React, { useState } from "react";
import emojiIcon from "../../assets/emoji.svg";
import paperClip from "../../assets/paperclip.svg";
import sendIcon from "../../assets/send.svg";
import file from '../../assets/file.png';
import closeIcon from '../../assets/close-icon.svg';

import Picker from "emoji-picker-react";
import IconButton from '@mui/material/IconButton';

import {Buttons, Container, Icon, Input, Pin, Form, Send, PinnedFile, UnpinFile} from "./ChatInput.styles";


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
      props.sendMessage({msg: msg, file: selectedFile})
      setMsg("");
      setSelectedFile()
    }
  };

  const unpinFile = () => {
    setSelectedFile(null)
  }


  const handleAttachFile = async (event) => {
    setSelectedFile(event.target.files[0]);
  }

  return (
    <Container >
      <Buttons>
        {/*<div className="emoji">*/}
        {/*  <Icon src={emojiIcon} onClick={handleEmojiPickerhideShow} />*/}
        {/*  {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}*/}
        {/*</div>*/}
        <Pin>
          <div>
            <input
              // accept="image/*"
              style={{ display: "none" }}
              id="upload-file"
              type="file"
              onChange={handleAttachFile}
            />
            <label htmlFor="upload-file">
              <IconButton color="primary" component="span">
                <Icon src={paperClip} />
              </IconButton>
            </label>
          </div>
        </Pin>
        {selectedFile ?
            <PinnedFile>
              <UnpinFile src={closeIcon} onClick={unpinFile}/>
              <img src={file}/>
            </PinnedFile>
            : <></>
        }
      </Buttons>
      <Form className="input-container" onSubmit={(event) => sendChat(event)}>
        <Input
          placeholder="Сообщение..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <Send type="submit">
          <Icon src={sendIcon} />
        </Send>
      </Form>
    </Container>
  );
}
