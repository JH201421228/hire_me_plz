import React from 'react'
import styled from 'styled-components'
import Ranking from '../components/Ranking';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/userSlice';
import { getAuth, signOut } from 'firebase/auth';
import app from '../firebase';
import { useNavigate } from 'react-router-dom';

const MasterContainer = styled.div`
  width: 40%;
  min-width: 500px;
  height: 450px;
  border-radius: 5px;
  margin: 2rem 2rem 0 0;
  gap: 4rem;
  display: flex;
`;

const QuizContainer = styled.div`
    display: flex;
    flex-direction : column;
    justify-content: space-between;
    align-items: center;
`

const QuizButton = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 10rem;
    height: 10rem;
    border: 5px solid rgb(80, 80, 80);
    cursor: pointer;

    transition: transform 0.3s;

    &:hover {
        transform: scale(1.1);
    }
`

const QuizSpan = styled.span`
    color: rgb(80, 80, 80);
    font-weight: bold;
    font-size: 2rem;
`

const TextSpan = styled.span`
    color: rgb(80, 80, 80);
    font-weight: bold;
    font-size: 1.2rem;
`

const LogoutButton = styled.button`
    border-radius: 5px;
    border: none;
    color: white;
    background-color: #007bff;
    width: 10rem;
    padding: 0.5rem 0;
`;

const RightPanel = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userInfo = useSelector(state => state.user)

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch(clearUser());
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <MasterContainer>
            <Ranking />
            <QuizContainer>
                <QuizButton className='shadow' style={{ backgroundColor: 'rgb(255, 150, 138)' }} onClick={() => { navigate(`/quiz/${userInfo.currentUser.uid}`) }}>
                    <QuizSpan>
                        QUIZ
                    </QuizSpan>
                    <TextSpan>
                        ALONE
                    </TextSpan>
                </QuizButton>
                <QuizButton className='shadow' style={{ backgroundColor: 'rgb(203, 170, 203)' }}>
                    <QuizSpan>
                        QUIZ
                    </QuizSpan>
                    <TextSpan>
                        TOGETHER
                    </TextSpan>
                </QuizButton>
                <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
            </QuizContainer>
        </MasterContainer>
    )
}

export default RightPanel