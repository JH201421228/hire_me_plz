import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";
import { clearUser } from "../store/userSlice"; 

const Chat = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user);
    const [message, setMessage] = useState("");
    const [chats, setChats] = useState([]);
    const messageEndRef = useRef(null)
    const currentTime = new Date().toISOString()
    const [beforeUser, setBeforeUser] = useState("")
    useEffect(() => {
        // Firebase Realtime Database에서 채팅 메시지를 가져와서 설정합니다.
        const db = getDatabase();
        const chatRef = ref(db, "chats");
        onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // 채팅 메시지를 배열로 변환하여 상태에 설정합니다.
                const chatMessages = Object.values(data);
                setChats(chatMessages);
            }
        });
    }, []);

    useEffect(() => {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    })

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch(clearUser());
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const sendMessage = () => {
        if (message.trim() !== "") {
            const db = getDatabase();
            const chatRef = ref(db, "chats");
            push(chatRef, {
                message: message,
                sender: userInfo.currentUser.uid,
                displayName: userInfo.currentUser.displayName,
                timestamp: currentTime,
            });
            // 메시지를 보낸 후 입력 필드를 초기화합니다.
            setMessage("");
        }
    };

    const enterSendMessage = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    return (
        <div className="container">
            <div style={{ width: '50%', minWidth: '500px', height: '500px', border: '5px solid black', borderRadius: '20px', padding: '1rem' }}>
                {/* 채팅 메시지 출력 */}
                <div style={{ overflowY: 'scroll', height: '400px', marginBottom: '1rem', width: "auto", overflowX: 'hidden' }}>
                    {chats.map((chat, index) => (
                        <div key={index}>
                            {chat.sender === userInfo.currentUser.uid ?
                                <div className="d-flex flex-column" style={{ width: "100%" }}>
                                    <div style={{ alignSelf: "flex-end" }}>{chat.message}</div>
                                </div>
                                :
                                <div className="d-flex flex-column" style={{ width: "100%" }}>
                                    <div style={{ alignSelf: "flex-start" }}>[{chat.displayName}] {chat.message}</div>
                                </div>
                            }
                        </div>))}
                    <div ref={messageEndRef}></div>
                </div>
                {/* 채팅 입력 필드 */}
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div className="d-flex gap-2" style={{ width: "100%" }}>
                        <input
                            className="px-2"
                            style={{ width: "70%" }}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyUp={(e) => enterSendMessage(e)}
                        />
                        {/* 채팅 전송 버튼 */}
                        <button onClick={sendMessage}>Send</button>
                    </div>
                    {/* 로그아웃 버튼 */}
                    <button onClick={handleLogout}>logout</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
