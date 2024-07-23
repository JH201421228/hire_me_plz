import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, push, onValue, query, limitToLast } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import styled from "styled-components";
import app from "../firebase";
import { clearUser } from "../store/userSlice";

const ChatContainer = styled.div`
  width: 50%;
  min-width: 500px;
  height: 450px;
  border: 5px solid rgb(80, 80, 80);
  border-radius: 5px;
  padding: 1rem;
  margin: 2rem;
  background-color: white;
`;

const ChatMessages = styled.div`
  overflow-y: auto;
  height: 350px;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const MessageInputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const MessageInput = styled.input`
  width: 75%;
  padding: 0.5rem;
  border-radius: 5px;
`;

const SendMessageButton = styled.button`
  border-radius: 5px;
  border: none;
  color: white;
  background-color: #007bff;
  padding: 0.5rem 1rem;
`;

const HideButton = styled.button`
  border-radius: 5px;
  border: none;
  color: white;
  background-color: #007bff;
  padding: 0.5rem 1rem;
`;

const ButtonContainer = styled.div`
  margin: 2rem;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Chat = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const messageEndRef = useRef(null);
  const currentTime = new Date().toISOString();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Firebase Realtime Database에서 마지막 100개의 채팅 메시지를 가져와서 설정합니다.
    const db = getDatabase();
    const chatRef = ref(db, "chats");
    const chatQuery = query(chatRef, limitToLast(100));
    onValue(chatQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 채팅 메시지를 배열로 변환하여 상태에 설정합니다.
        const chatMessages = Object.values(data);
        setChats(chatMessages);
      }
    });
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

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
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {hide ? (
        <ButtonContainer>
          <HideButton onClick={() => setHide(!hide)}>Show</HideButton>
        </ButtonContainer>
      ) : (
        <ChatContainer>
          {/* 채팅 메시지 출력 */}
          <ChatMessages>
            {chats.map((chat, index) => (
              <MessageContainer key={index}>
                {chat.sender === userInfo.currentUser.uid ? (
                  <div style={{ alignSelf: "flex-end" }}>{chat.message}</div>
                ) : (
                  <div style={{ alignSelf: "flex-start" }}>
                    [{chat.displayName}] {chat.message}
                  </div>
                )}
              </MessageContainer>
            ))}
            <div ref={messageEndRef}></div>
          </ChatMessages>
          {/* 채팅 입력 필드 */}
          <MessageInputContainer>
            <MessageInput
              type="text"
              placeholder="Chat Here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={(e) => enterSendMessage(e)}
            />
            {/* 채팅 전송 버튼 */}
            <SendMessageButton onClick={sendMessage}>Send</SendMessageButton>
            {/* 로그아웃 버튼 */}
            {/* <LogoutButton onClick={handleLogout}>Logout</LogoutButton> */}
            <HideButton onClick={() => setHide(!hide)}>Hide</HideButton>
          </MessageInputContainer>
        </ChatContainer>
      )}
    </>
  );
};

export default Chat;
