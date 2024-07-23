import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, get, update, set } from 'firebase/database';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

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
  overflow: auto;
`;

const LogoBar = styled.img`
  max-width: 500px;
  height: 200px;
`;

const LoadingWord = styled.p`
  color: #007bff;
  text-align: center;
  font-weight: bold;
  font-size: 3rem;
  text-shadow: 3px 3px rgb(80, 80, 80);
`;

const QuizContainer = styled.div`
  width: 80%;
  height: 40%;
  min-height: 200px;
  min-width: 500px;
  background-color: rgb(151, 193, 169);
  margin: 2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 5px solid rgb(80, 80, 80);
  border-radius: 10px;
`

const QuizNum = styled.h1`
  color: white;
  font-weight: bold;
  text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
`

const QuizText = styled.h2`
  color: white;
  font-weight: bold;
  text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
`

const BottomContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1rem;
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
    color: white;
    font-weight: bold;
    text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
    font-size: 5rem;

    transition: transform 0.3s;

    &:hover {
        transform: scale(1.1);
    }
`

const AnswerBox = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 34rem;
    height: 10rem;
    border: 5px solid rgb(80, 80, 80);
    color: white;
    font-weight: bold;
    text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
    font-size: 2rem;
    background-color: rgb(255, 255, 181);
`

const TimeBox = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 10rem;
    height: 10rem;
    border: 5px solid rgb(80, 80, 80);
    color: white;
    font-weight: bold;
    text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
    font-size: 2rem;
    background-color: rgb(85, 203, 205);
`

const InfoBox = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 10rem;
    height: 10rem;
    border: 5px solid rgb(80, 80, 80);
    color: white;
    font-weight: bold;
    text-shadow: -2px 0px rgb(80, 80, 80), 2px 0px rgb(80, 80, 80), 0px -2px rgb(80, 80, 80), 0px 2px rgb(80, 80, 80);
    font-size: 2rem;
    background-color: rgb(236, 234, 228);
`

const ExitButton = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 10rem;
    height: 10rem;
    color: white;
    font-weight: bold;
    font-size: 2rem;
    background-color: #007bff;
    cursor: pointer;
`

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const userInfo = useSelector(state => state.user);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const randomNumbers = Array.from({ length: 10 }, () => Math.floor(Math.random() * 8533) + 1);
      const fetchedQuizzes = [];

      for (const num of randomNumbers) {
        const questionRef = ref(db, `questions/${num}`);
        const snapshot = await get(questionRef);
        if (snapshot.exists()) {
          fetchedQuizzes.push(snapshot.val().question);
        }
      }

      setQuizzes(fetchedQuizzes);
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !showAnswer) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswer(null);
    }

    return () => clearInterval(timer); // 클린업 함수로 기존 타이머를 정리합니다.
  }, [timeLeft, showAnswer]);

  const handleAnswer = (answer) => {
    if (showAnswer) return; // 중복 실행 방지

    setShowAnswer(true);
    let updatedScore = score;
    if (answer !== null) {
      setUserAnswer(answer);
      const correctAnswer = quizzes[currentQuiz].endsWith("(O)") ? 'O' : 'X';
      if (answer === correctAnswer) {
        updatedScore = score + 1;
        setScore(updatedScore);
      }
    }
    setTimeout(() => {
      if (currentQuiz < quizzes.length - 1) {
        setCurrentQuiz((prevQuiz) => prevQuiz + 1);
        setUserAnswer(null);
        setTimeLeft(5);
        setShowAnswer(false);
      } else {
        setShowModal(true);
        updateRank(updatedScore);
      }
    }, 2000);
  };

  const updateRank = async (finalScore) => {
    const rankRef = ref(db, `rank/${userInfo.currentUser.uid}`);
    const snapshot = await get(rankRef);

    if (snapshot.exists()) {
      const currentRank = snapshot.val();
      await update(rankRef, {
        ...currentRank,
        score: currentRank.score + finalScore,
      });
    } else {
      await set(rankRef, {
        name: userInfo.currentUser.displayName,
        score: finalScore,
      });
    }
  };

  if (quizzes.length === 0)
    return (
      <MasterContainer>
        <LogoBar src="/images/iwbtd2.jpg" />
        <LoadingWord>
          Loading Now...
        </LoadingWord>
      </MasterContainer>
    );

  return (
    <MasterContainer>
      <LogoBar src="/images/iwbtd2.jpg" />
      <QuizContainer>
        <QuizNum>Q. {currentQuiz + 1}</QuizNum>
        <QuizText>{quizzes[currentQuiz].replace(/\s?\(O\)|\s?\(X\)$/, '')}</QuizText>
      </QuizContainer>
      <BottomContainer>
        {!showAnswer ? (
          <>
            <QuizButton style={{ backgroundColor: 'rgb(203, 170, 203)' }} onClick={() => handleAnswer('O')}>O</QuizButton>
            <QuizButton style={{ backgroundColor: 'rgb(255, 150, 138)' }} onClick={() => handleAnswer('X')}>X</QuizButton>
            <TimeBox>
              남은 시간
              <br />
              {timeLeft}초
            </TimeBox>
          </>
        ) : (
          <AnswerBox>
            {userAnswer === null
              ? '시간 초과!'
              : `당신의 답: ${userAnswer}`}
            <br />
            {quizzes[currentQuiz].endsWith("(O)") ? '정답: O' : '정답: X'}
          </AnswerBox>
        )}
        <InfoBox>
          현재 점수
          <br />
          {score}/{quizzes.length}
        </InfoBox>
        <ExitButton onClick={() => navigate(-1)}>EXIT</ExitButton>
      </BottomContainer>

      {showModal ?
        <Modal show={showModal} onHide={() => { setShowModal(false), navigate('/') }} centered>
          <Modal.Header closeButton>
            <Modal.Title>RESULT</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            퀴즈가 끝났습니다. 총 점수: {score}/{quizzes.length}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="secondary" onClick={() => {setShowModal(false), window.location.reload()}}>
              AGIN
            </Button> */}
            <Button variant="primary" onClick={() => { setShowModal(false), navigate('/') }}>
              EXIT
            </Button>
          </Modal.Footer>
        </Modal>
        :
        <></>
      }

    </MasterContainer>
  );
};

export default QuizPage;
