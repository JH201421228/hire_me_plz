import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';

const AddRoom = () => {
    const db = getDatabase();
    const roomRef = ref(db, 'rooms');
    const navigate = useNavigate();

    // 모달 상태를 관리하는 변수
    const [showModal, setShowModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [usePassword, setUsePassword] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleRoomNameChange = (event) => setRoomName(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleCheckboxChange = () => setUsePassword(!usePassword);

    const addRoomHandle = () => {
        const newRoomRef = push(roomRef, {
            roomName: roomName,
            password: usePassword ? password : '', // 비밀번호 사용 여부에 따라 저장
            userNum: 0
        });
        const newRoomId = newRoomRef.key;
        console.log("새 방의 ID:", newRoomId);

        // 방 생성 후 모달을 닫습니다.
        handleClose();

        navigate(`/${newRoomId}`);
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                방 만들기
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="roomName">
                            <Form.Label>방 이름</Form.Label>
                            <Form.Control type="text" placeholder="방 이름을 입력하세요" value={roomName} onChange={handleRoomNameChange} />
                        </Form.Group>
                        <Form.Group controlId="usePassword">
                            <Form.Check type="checkbox" label="비밀번호 사용" checked={usePassword} onChange={handleCheckboxChange} />
                        </Form.Group>
                        {usePassword && (
                            <Form.Group controlId="password">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={handlePasswordChange} />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={addRoomHandle}>
                        만들기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AddRoom;
