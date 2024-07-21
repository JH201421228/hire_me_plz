import React from 'react'
import styled from 'styled-components'


const MasterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
`

const TopBar = styled.div`
    background-color: #007bff;
    width: 100%;
    padding: 0.5rem;
    text-align: center;
    color: white;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    border: 5px solid rgb(80, 80, 80);
    border-bottom: none;
`

const BodyContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 0 0 5px 5px;
    border: 5px solid rgb(80, 80, 80);
    border-top: none;
    background-color: white;
`

const Ranking = () => {
  return (
    <MasterContainer>
        <TopBar>RANK</TopBar>
        <BodyContainer></BodyContainer>
    </MasterContainer>
  )
}

export default Ranking