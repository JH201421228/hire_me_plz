// src/upload.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';

const Upload = () => {
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!fileContent) return;

    const lines = fileContent.split("\n");

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index].trim();
      if (line.startsWith("[문제]") && (line.endsWith("(O)") || line.endsWith("(X)"))) {
        // 전체 라인을 저장합니다.
        const fullQuestion = line;
        const questionRef = ref(db, `questions/${index + 1}`);
        await set(questionRef, { question: fullQuestion });
      }
    }

    alert("업로드가 완료되었습니다.");
  };

  return (
    <div>
      <h1>텍스트 파일 업로드</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
};

export default Upload;
