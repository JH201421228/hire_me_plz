// src/quiz.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showAnswer, setShowAnswer] = useState(false);

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
    if (timeLeft > 0 && !showAnswer) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleAnswer(null);
    }
  }, [timeLeft, showAnswer]);

  const handleAnswer = (answer) => {
    setShowAnswer(true);
    if (answer !== null) {
      setUserAnswer(answer);
      const correctAnswer = quizzes[currentQuiz].endsWith("(O)") ? 'O' : 'X';
      if (answer === correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      }
    }
    setTimeout(() => {
      if (currentQuiz < quizzes.length - 1) {
        setCurrentQuiz((prevQuiz) => prevQuiz + 1);
        setUserAnswer(null);
        setTimeLeft(5);
        setShowAnswer(false);
      } else {
        alert(`퀴즈가 끝났습니다. 총 점수: ${score}/${quizzes.length}`);
      }
    }, 2000);
  };

  if (quizzes.length === 0) return <div>퀴즈를 로딩 중입니다...</div>;

  return (
    <div>
      <h1>O, X 퀴즈</h1>
      <div>
        <h2>{quizzes[currentQuiz]}</h2>
        {!showAnswer ? (
          <div>
            <button onClick={() => handleAnswer('O')}>O</button>
            <button onClick={() => handleAnswer('X')}>X</button>
            <p>남은 시간: {timeLeft}초</p>
          </div>
        ) : (
          <p>
            {userAnswer === null
              ? '시간 초과!'
              : `당신의 답: ${userAnswer}`}
            <br />
            {quizzes[currentQuiz].endsWith("(O)") ? '정답: O' : '정답: X'}
          </p>
        )}
      </div>
      <p>현재 점수: {score}/{quizzes.length}</p>
    </div>
  );
};

export default QuizPage;
