import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import SidePanel from "./SidePanel";

const MainPage = () => {
    const user = useSelector(state => state.user)
    return (
        <div className="container">
            <p>{user.currentUser.displayName}</p>
            <p>MainPage</p>
            <Chat/>
            <SidePanel/>
        </div>
    )
}

export default MainPage