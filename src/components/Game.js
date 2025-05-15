import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomWord } from '../data/pcWords';
import Timer from './Timer';
import TypingArea from './TypingArea';
import { 
  KeyboardIcon, MonitorIcon, CPUIcon, MouseIcon, 
  ServerIcon, HardDiskIcon, CodeIcon, WifiIcon 
} from '../assets/ComputerIcons';

const Game = ({ onGameEnd, timeLeft, setTimeLeft }) => {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [typedWords, setTypedWords] = useState([]);
  const inputRef = useRef(null);

  // ランダムなアイコンを取得する関数
  const getRandomIcons = useCallback((count) => {
    // アイコンの配列をコールバック内に移動
    const icons = [
      <KeyboardIcon key="keyboard" />,
      <MonitorIcon key="monitor" />,
      <CPUIcon key="cpu" />,
      <MouseIcon key="mouse" />,
      <ServerIcon key="server" />,
      <HardDiskIcon key="harddisk" />,
      <CodeIcon key="code" />,
      <WifiIcon key="wifi" />
    ];
    const shuffled = [...icons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);
  
  // 背景アイコンの状態
  const [backgroundIcons, setBackgroundIcons] = useState([]);
  
  // 初回レンダリング時にアイコンを設定
  useEffect(() => {
    setBackgroundIcons(getRandomIcons(15));
  }, [getRandomIcons]);

  // endGameをuseCallbackで包む
  const endGame = useCallback(() => {
    setIsGameActive(false);
    onGameEnd(score);
  }, [onGameEnd, score]);

  // ゲーム開始時にフォーカスを入力欄に設定
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // タイマー処理
  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, endGame, setTimeLeft]);

  const handleInputChange = (e) => {
    if (!isGameActive) return;
    
    const value = e.target.value;
    setInput(value);

    // ローマ字入力が完了したら次の単語へ
    if (value.toLowerCase() === currentWord.romaji.toLowerCase()) {
      // スコアを加算
      const newScore = score + currentWord.score;
      setScore(newScore);
      
      // タイプした単語を記録
      setTypedWords([...typedWords, currentWord]);
      
      // 入力をリセットして次の単語を設定
      setInput('');
      setCurrentWord(getRandomWord());
    }
  };

  return (
    <>
      {/* 背景のランダムアイコン */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {backgroundIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute text-terminal-green-dark opacity-20"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              transform: `scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random() * 360}deg)`,
              width: '50px',
              height: '50px'
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      <div className="game-content flex flex-col items-center z-10 relative">
        <div className="w-full mb-6">
          <div className="score text-3xl font-bold">
            スコア: <span className="text-4xl">{score}</span>
          </div>
        </div>

        <TypingArea 
          input={input} 
          onInputChange={handleInputChange} 
          isGameActive={isGameActive}
          inputRef={inputRef}
          expectedInput={currentWord.romaji} 
          japaneseWord={currentWord.word}
          inputMode="romaji" 
          showProgress={true}
        />

        <div className="typed-words-container h-32 mt-8 w-full overflow-y-auto">
          <h3 className="text-xl mb-2 sticky top-0 bg-terminal-black">タイプした単語:</h3>
          <div className="typed-words-content">
            <ul className="flex flex-wrap gap-2">
              {typedWords.map((word, index) => (
                <li key={index} className="border border-terminal-green px-3 py-2 rounded">
                  {word.word}
                </li>
              ))}
              {typedWords.length === 0 && <li className="text-gray-500">まだ単語をタイプしていません</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game; 