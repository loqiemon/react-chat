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
    padding: 10px 20px 10px 150px;
    @media (max-width: 570px) {
        padding: 10px 20px 10px 90px;
    }
`

export const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

export const ChatSearchDiv = styled.div`
        display: flex;
        align-items: center;
        width: 350px;
        background-color: ${({theme}) => theme.color.inputBack2};
        border-radius: 10px;
        padding: 10px 15px 10px 15px;
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 15px;
    
        @media (max-width: 570px) {
            width: 100%;
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

export const NotFound = styled.span`
    color: ${({theme}) => theme.color.text};
    font-size: 22px;
    text-align: center;
    margin-top: 15px;
`

export const UserList = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    overflow-y: scroll;
`

export const ChatSearchIcon = styled.img`
        filter: ${({theme}) => theme.color.light ? 'invert(29%) sepia(41%) saturate(6%) hue-rotate(322deg) brightness(85%) contrast(90%)' : 'none'};
`

export const UserProfile = styled.div`
    display: inline-flex;
    border-radius: 20px;
    width: 300px;
    gap: 10px;
    padding: 10px;
    font-size: 20px;
    background-color: ${({theme}) => theme.color.inputBack2};
    margin-top: 15px;

    @media (max-width: 570px) {
        padding: 15px;
        width: 250px;
    }
`

export const Flex = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;
    @media (max-width: 570px) {
        padding: 0;
        gap: 15px;
    }
`

export const UserProfileName = styled.span`
    color: ${({theme}) => theme.color.text};
`

export const UserAddButton = styled.button`
    color: ${({theme}) => theme.common.white};
    background-color: ${({theme}) => theme.common.greenBack};
    border: none;
    border-radius: 20px;
    padding: 8px 30px;
    font-size: 20px;
`

