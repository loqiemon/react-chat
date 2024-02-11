import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
export const Container = styled.div`
    height: 100vh;
    width: 300px;
    text-align: center;
    background-color: ${({theme}) => theme.color.messengerBackground};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    overflow-x: hidden;

    &.hidden {
        @media (max-width: 990px) {
            display: none;
        }
    }

    //@media (max-width: 690px) {
    //    width: 90%;  
    //}
`

export const IconButton2 = styled(IconButton)`
    @media screen and (max-width: 990px) {
        display: none;
    }
`

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 15px 6px 0 6px;
`

export const Title = styled.h2`
    font-size: 30px;
    font-weight: 500;
    color: ${({theme}) => theme.color.messengerTitle};
`

export const HeaderText = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`

export const ChatSearch = styled.input`
    background-color: ${({theme}) => theme.color.inputBack};
    font-size: 20px;
    color: ${({theme}) => theme.color.textInverted};
    border: none;
    width: 250px;
    height: 40px;
    padding: 10px 15px 10px 15px;
    border-radius: 10px;
    
    &:focus {
        outline: none;
    }
`

export const ChatList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const ChatItem = styled.div`
    padding: 10px 8px;
    display: flex;
    gap: 8px;
    transition: all .3s;
    color: ${({theme}) => theme.color.textInverted};

    &:hover {
        cursor: pointer;
        background-color: #eeeeee;
        color: ${({theme}) => theme.common.a1};
    }

    &.selected {
        background-color: ${({theme}) => theme.common.messageBack};
        color: ${({theme}) => theme.common.a1};
    }
`

export const ChatImg = styled.img`
    width: 45px;
    height: 45px;
`

export const ChatInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
`

export const ChatHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`

export const ChatName = styled.span`
    font-size: 20px;
    max-width: 170px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

export const ChatTime = styled.span`
    font-size: 16px;
`

export const ChatMessage = styled(ChatName)`
    font-size: 18px;
    font-weight: 300;
    text-align: left;
`