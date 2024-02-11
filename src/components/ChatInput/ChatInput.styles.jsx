import styled from 'styled-components';


export const Input = styled.input`
    background: transparent;
    color: ${({ theme }) => theme.color.text};
    border: none;
    width: 100%;
    font-weight: 300;
    font-size: 20px;
    
    &:focus {
        outline: none;
    }
`

export const Form = styled.form`
    width: 100%;
    display: flex;
    gap: 5px;
    justify-content: space-between;
`

export const Icon = styled.img`
    ${({ theme }) => theme.color.light ? 'none' : 'filter: invert(98%) sepia(0%) saturate(3327%) hue-rotate(214deg) brightness(113%) contrast(74%);'}
`

export const Send = styled.button`
    border-radius: 20px;
    border: none;
    background-color: ${({ theme }) => theme.common.greenBack};
    padding: 6px 30px;
`


export const Pin = styled.div`
    
`

export const Buttons = styled.div`
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.color.text};
      position: relative;
      gap: 7px;
      .emoji {
        width: 22px;
        position: relative;
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
`

export const UnpinFile = styled.img`
    
`

export const PinnedFile = styled.div`
    background-color: ${({theme}) => theme.common.messageBack};
    position: absolute;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    padding: 10px;
    
    img {
        width: 100px;
        height: 100px;
    }
    
    ${UnpinFile} {
        width: 15px;
        position: absolute;
        top: -35px;
        right: 5px;
    }
`

export const Container = styled.div`
    width: clamp(340px, 90%, 1120px);

    align-items: center;
    display: flex;
    box-shadow: 0 0 39px 0 rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    padding: 10px;

    background: ${({ theme }) => theme.color.messengerBackground};
    color: ${({ theme }) => theme.color.textInverted};
    position: fixed;
    bottom: 0;

    
    @media (max-width: 1600px) {
        width: 800px;
    }

    @media (max-width: 1275px) {
        width: 500px;
    }

      @media (max-width: 590px) {
        width: 80%;
      }

  @media (max-width: 380px) {
    width: 70%;
  }

    //.button-container {

    //  gap: 1rem;
    //  .pin {
    //    svg {
    //      color: black;
    //    }
    //  }

    //}
    //.input-container {
    //  width: 95%;
    //  border-radius: 2rem;
    //  display: flex;
    //  align-items: center;
    //  // gap: 2rem;
    //  // background-color: #ffffff34;
    //  input {
    //    width: 90%;
    //    // height: 60%;
    //    background-color: transparent;
    //    border: none;
    //    padding-left: 1rem;
    //    font-size: 1.2rem;  
    //    align-self: center;
    //    &::selection {
    //      background-color: #9a86f3;
    //    }
    //    &:focus {
    //      outline: none;
    //    }
    //  }
    //  button {
    //    width: 10%;
    //    height: 3rem;
    //    padding: 0.3rem 2rem;
    //    border-radius: 2rem;
    //    display: flex;
    //    justify-content: center;
    //    align-items: center;
    //    background-color: #9a86f3;
    //    border: none;
    //    @media screen and (min-width: 720px) and (max-width: 1080px) {
    //      padding: 0.3rem 1rem;
    //      svg {
    //        font-size: 1rem;
    //      }
    //    }
    //    svg {
    //      font-size: 2rem;
    //      color: white;
    //    }
    //  }
}
.EmojiPickerReact {
    height: 25rem;
    width: 350px;
    margin-top: -33rem;
}
`