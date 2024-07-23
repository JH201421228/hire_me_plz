import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';

const MasterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
`;

const TopBar = styled.div`
    background-color: #007bff;
    width: 100%;
    padding: 0.5rem;
    text-align: center;
    color: white;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    border: 5px solid rgb(80, 80, 80);
    border-bottom: none;
`;

const BodyContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 0 0 5px 5px;
    border: 5px solid rgb(80, 80, 80);
    border-top: none;
    background-color: white;
    overflow-y: auto;
`;

const RankingItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgb(200, 200, 200);

    &:last-child {
        border-bottom: none;
    }
`;

const RankName = styled.span`
    font-weight: bold;
    color: rgb(80, 80, 80);
`;

const RankScore = styled.span`
    font-weight: bold;
    color: rgb(80, 80, 80);
`;

const Ranking = () => {
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        const fetchRankingData = async () => {
            const rankRef = query(ref(db, 'rank'), orderByChild('score'), limitToLast(10));
            const snapshot = await get(rankRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sortedData = Object.entries(data)
                    .map(([key, value]) => ({ id: key, ...value }))
                    .sort((a, b) => b.score - a.score);
                setRankingData(sortedData);
            }
        };

        fetchRankingData();
    }, []);

    return (
        <MasterContainer>
            <TopBar>RANK</TopBar>
            <BodyContainer>
                {rankingData.map((user, index) => (
                    <RankingItem key={user.id}>
                        <RankName>{index + 1}. {user.name}</RankName>
                        <RankScore>{user.score}</RankScore>
                    </RankingItem>
                ))}
            </BodyContainer>
        </MasterContainer>
    );
};

export default Ranking;
