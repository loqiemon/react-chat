import styled from 'styled-components';


export const Title = styled.h1`
    color: ${({theme}) => theme.color.text};
    font-size: 30px;
    font-weight: 500;
    text-align: center;
`

export const Container = styled.div`
    background-color: ${({theme}) => theme.color.background};
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: 300px auto;
`

export const ChatSearchDiv = styled.div`
        display: flex;
        align-items: center;
        width: 350px;
        background-color: ${({theme}) => theme.color.inputBack};
        border-radius: 10px;
        padding: 10px 15px 10px 15px;
        justify-content: space-between;

        @media (max-width: 670px) {
            display: none;
        }
`

export const ChatSearchInput = styled.input`
        background: transparent;
        color: ${({theme}) => theme.color.textInverted};
        border: none;

        &:focus {
                outline: none;
        }
`

export const ChatSearchIcon = styled.img`
        filter: ${({theme}) => theme.color.light ? 'invert(29%) sepia(41%) saturate(6%) hue-rotate(322deg) brightness(85%) contrast(90%)' : 'none'};
`

export const UserProfile = styled.div`
    display: flex;
    border-radius: 20px;
    width: 300px;
    gap: 10px;
    padding: 10px;
    font-size: 20px;
`

export const UserProfileName = styled.span`
    color: ${({theme}) => theme.color.text};
`

export const UserAddButton = styled.button`
    color: ${({theme}) => theme.common.white};
    background-color: ${({theme}) => theme.common.greenBack};
    border: none;
    border-radius: 20px;
    padding: 10px 35px;
    font-size: 20px;
`