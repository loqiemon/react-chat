import styled from "styled-components";

export const Modal = (props) => {
    const {  } = props;
    return (
        <Container>
            <Content>
                123
                <Input/>
                <span className="close">&times;</span>
            </Content>
        </Container>
    )
}

const Container = styled.div`
    display: none; 
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
    background-color: #fefefe;
    margin: 15% auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 80%;

    .close {
        color: #aaa;
        float: right;
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