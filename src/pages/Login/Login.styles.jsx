import styled from 'styled-components';
import {Link} from "react-router-dom";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 12px;
    background-color: #ebebeb;
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 2rem;
    padding: 3rem 5rem;
    width: clamp(200px, 100%, 470px);

    h1 {
        color: #338B63;
        text-transform: uppercase;
        font-weight: 700;
    }

    input {
        background-color: #DEDEDE;
        border-radius: 10px;
        padding: 13px 15px;
        width: 100%;
        border: none;


        &:focus {
            outline: none;
        }
    }

    span {
        text-transform: uppercase;
        font-weight: 400;
        font-size: 18px;
        color: #494949;
    }

    button {
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
    }

`

export const Link2 = styled(Link)`
    font-weight: 600;
    color: #338b63;
    
    text-decoration: none;
`