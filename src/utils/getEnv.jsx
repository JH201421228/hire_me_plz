// 환경변수에서 특정 변수를 가져오는 함수
const getEnv = key => {
    return import.meta.env[`VITE_${key}`];
  };
  
export default getEnv;