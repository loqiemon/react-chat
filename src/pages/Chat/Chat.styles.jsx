import styled from 'styled-components';


export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 300px auto;
    
    @media (max-width: 990px) {
        grid-template-columns: auto;
    }
`

export const MainContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    padding-left: 150px;
      @media (max-width: 670px) {
        padding-left: 70px;
      }
`