import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RoomList = () => {

    const db = getDatabase();
    const roomRef = ref(db, 'rooms');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate()

    // useEffect(() => {
    //     const getData = async () => {
    //         try {
    //             onValue(roomRef, (snapshot) => {
    //                 const data = snapshot.val();
    //                 if (data) {
    //                     const roomsInfo = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
    //                     setRooms(roomsInfo);
    //                 } else {
    //                     console.log("No data available");
    //                 }
    //             });
    //         } catch (error) {
    //             console.error("Error fetching data: ", error);
    //         }
    //     };
    //     getData();
    // }, []);
    useEffect(() => {
        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomsInfo = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
                setRooms(roomsInfo);
            } else {
                console.log("No data available");
            }
        });
    }, []);

    return (
        <div>
            <h2>방 목록</h2>
            <ul>
                {rooms.map((room, index) => (
                    <li key={index}>
                        <div onClick={() => navigate(`/${room.id}`)}>
                            <p>방 이름: {room.roomName}</p>
                            {room.password && <p>비밀번호: {room.password}</p>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
