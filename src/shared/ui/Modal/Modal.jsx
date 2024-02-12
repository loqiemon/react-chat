import styled from "styled-components";
import {useState} from "react";

export const Modal = (props) => {
    const { closeModal, handleSubmit, values } = props;
    const [input, setInput] = useState('');

    const sendData = () => {
        handleSubmit(values.username, values.password, input)
    }

    return (
        <Container>
            <Content>
                <Input onChange={e => setInput(e.target.value)} value={input}/>
                <span className="close" onClick={_ => closeModal(false)}>&times;</span>
                <Button onClick={sendData}>Отправить</Button>
            </Content>
        </Container>
    )
}

const Container = styled.div`
    position: fixed; 
    z-index: 1;
    left: 0;
    top: 0;
    width: 100vw; 
    height: 100vh; 
    overflow: auto; 
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4); 
`

const Content = styled.div`
    position: absolute;
    background-color: #fefefe;
    //margin: 35% auto; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid #888;
    width: clamp(200px, 100%, 300px);

    .close {
        position: absolute;
        top: 0;
        right: 5px;
        color: #aaa;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`

const Input = styled.input`
    background-color: #DEDEDE;
    border-radius: 10px;
    padding: 13px 15px;
    width: 100%;
    border: none;


    &:focus {
        outline: none;
    }
`

const Button = styled.button`
  margin-top: 15px;
  border-radius: 10px;
  padding: 13px 15px;
  width: 100%;
  font-weight: 600;
  font-size: 21px;
  text-transform: uppercase;
  color: #ebebeb;
  background: #338b63;
  border: none;
  transition: all .3s;
  cursor: pointer;

  &:hover {
    background: #20563d;
  }
`