import styled from 'styled-components';


export const Container = styled.div`
        height: 100vh;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        background-color: ${({ theme }) => theme.color.messagesBack};
`

export const ChatSearch = styled.div`
        width: 100%;
        background-color: ${({theme}) => theme.color.messengerBackground};
        color: ${({theme}) => theme.color.text};
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 50px;
`

export const ChatName = styled.span`
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

export const Flex2 = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

export const BackIcon = styled.img`
    transform: rotate(180deg);
    filter: ${({theme}) => theme.color.light ? 'invert(29%) sepia(41%) saturate(6%) hue-rotate(322deg) brightness(85%) contrast(90%)' : 'none'};
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

export const Messages = styled.div`
        padding: 10px;
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow-y: scroll;
        gap: 5px;
        padding-bottom: 80px;
`
export const Avatar = styled.img`
        width: 55px;
        height: 55px;
`

export const Description = styled.div`
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 7px;
        font-size: 20px;
`

export const Content = styled.div`
        display: flex;
        gap: 7px;
        min-width: 75px;

        padding: 12px 25px 25px 12px;
        background-color: ${({theme}) => theme.common.messageBack};
        border-radius: 0 20px 20px 20px;
`

export const MessageName = styled.span`
        color: ${({theme}) => theme.color.text};
`

export const Message = styled.div`
        max-width: 90%;
        display: flex;
        gap: 10px;

        &.sended {
                align-self: flex-end;

                ${Avatar} {
                        order: 2;
                }

                ${Content} {
                        border-radius: 20px 0 20px 20px;
                }

                ${MessageName} {
                        text-align: right;
                }
        }

`



export const MessageTime = styled.span`
        font-size: 17px;
        font-weight: 300;
        position: absolute;
        bottom: 0;
        right: 5px;
`