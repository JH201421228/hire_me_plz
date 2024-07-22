import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import SidePanel from "./SidePanel";
import styled from "styled-components";
import RightPanel from "./RightPanel";
import Upload from "../components/Upload";

const MasterContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(218, 218, 220);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
`;

const LogoBar = styled.img`
    max-width: 500px;
    margin: auto;
    display: block;
`;

const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

const MainPage = () => {
    const user = useSelector(state => state.user)
    return (
        <MasterContainer>
            <LogoBar src="/images/iwbtd2.jpg" />
            {/* <p>{user.currentUser.displayName}</p>
            <p>MainPage</p> */}
            <MainContainer>
                <Chat />
                <RightPanel />
            </MainContainer>
            {/* <Upload/> */}
        </MasterContainer>
    )
}

export default MainPage