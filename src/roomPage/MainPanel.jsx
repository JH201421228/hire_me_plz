import { get, getDatabase, onValue, ref, remove, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

const MainPanel = () => {
    const db = getDatabase();
    const navigate = useNavigate()

    useEffect(() => {
        const currentUrl = 'rooms' + location.pathname;
        const thisRoomRef = ref(db, currentUrl);

        // 유저가 방에 입장하면 userNum을 1 증가시키고 파이어베이스에 저장
        const enterRoom = async (signal) => {
            try {
                const snapshot = await get(thisRoomRef);
                const data = snapshot.val();
                if (data && signal === 'in') {
                    const updatedUserNum = data.userNum + 1;
                    update(thisRoomRef, { userNum: updatedUserNum });
                }
                else if (data && signal === 'out') {
                    const updatedUserNum = data.userNum - 1;
                    if (updatedUserNum === 0) {
                        await remove(thisRoomRef);
                    }
                    else {
                        update(thisRoomRef, { userNum: updatedUserNum });
                    }
                } 
                else {
                    console.log('MainPanel: No data found');
                    navigate(-1)
                }
            } catch (err) {
                console.error('MainPanel: Error entering room', err);
                navigate(-1)
            }
        };

        enterRoom('in');

        // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
        return () => {
            enterRoom('out')
        };
    }, []);

    return (
        <div>
            <p>
                room
            </p>
        </div>
    );
};

export default MainPanel;
