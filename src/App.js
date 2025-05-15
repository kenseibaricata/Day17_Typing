import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';
import Timer from './components/Timer';
import Fireworks from './components/Fireworks';
import { KeyboardIcon, CPUIcon, MonitorIcon } from './assets/ComputerIcons';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('typingScores');
    return savedScores ? JSON.parse(savedScores) : [];
  });
  const [currentScore, setCurrentScore] = useState(0);
  const [isTop3, setIsTop3] = useState(false);
  const [showingIcons, setShowingIcons] = useState([]); // 表示するアイコン
  const [rank, setRank] = useState(0); // ランキング順位
  const [timeLeft, setTimeLeft] = useState(60); // タイマー

  // ゲーム開始時にランダムなアイコンを表示
  useEffect(() => {
    const icons = [
      <KeyboardIcon key="keyboard" />,
      <CPUIcon key="cpu" />,
      <MonitorIcon key="monitor" />
    ];
    
    const randomIcons = [];
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * icons.length);
      randomIcons.push(icons[randomIndex]);
    }
    
    setShowingIcons(randomIcons);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setIsTop3(false);
    setTimeLeft(60); // タイマーをリセット
  };

  const endGame = (score) => {
    setCurrentScore(score);
    const newScore = {
      score,
      date: new Date().toISOString(),
    };
    
    const updatedScores = [...scores, newScore].sort((a, b) => b.score - a.score);
    setScores(updatedScores);
    localStorage.setItem('typingScores', JSON.stringify(updatedScores));
    
    // スコアがトップ3に入るか確認
    const playerRank = updatedScores.findIndex(s => s.score === score && s.date === newScore.date) + 1;
    setRank(playerRank);
    setIsTop3(playerRank <= 3 && score > 0);
    
    setGameState('gameover');
  };

  const resetGame = () => {
    setGameState('start');
    setIsTop3(false);
    setRank(0);
  };

  // アイコンをランダムな位置に配置するスタイル関数
  const getRandomPosition = (index) => {
    return {
      position: 'absolute',
      top: `${10 + Math.random() * 80}%`,
      left: `${10 + Math.random() * 80}%`,
      transform: `scale(${0.8 + Math.random()}) rotate(${Math.random() * 30 - 15}deg)`,
      opacity: 0.3,
      width: '50px',
      height: '50px',
      color: '#00ff00',
      zIndex: 0
    };
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-terminal-black min-h-screen text-terminal-green font-code flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景アイコン */}
      {showingIcons.map((icon, index) => (
        <div key={index} style={getRandomPosition(index)} className="hidden md:block">
          {icon}
        </div>
      ))}
      
      {/* 花火アニメーション - ゲーム終了画面でトップ3に入った場合のみ表示 */}
      {gameState === 'gameover' && <Fireworks show={isTop3} />}
      
      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-bold">タイピングマスター：PCワード編</h1>
        {gameState === 'playing' && (
          <div className="mt-2 text-center">
            <Timer timeLeft={timeLeft} size="large" />
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl relative z-10">
        {gameState === 'start' && (
          <div className="text-center">
            <p className="mb-6 text-xl">PCワード編：パソコン用語を半角英語で入力するタイピングゲームです</p>
            <p className="mb-4">制限時間: 60秒</p>
            <button 
              onClick={startGame}
              className="px-6 py-3 bg-terminal-green-dark text-terminal-green-light border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-black transition-colors"
            >
              ゲームスタート
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="game-container border-2 border-terminal-green p-6 rounded">
            <Game 
              onGameEnd={endGame} 
              timeLeft={timeLeft} 
              setTimeLeft={setTimeLeft} 
            />
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="text-center">
            <h2 className="text-2xl mb-4">ゲーム終了！</h2>
            <p className="mb-2 text-3xl">あなたのスコア: <span className="font-bold">{currentScore}</span></p>
            
            {isTop3 && (
              <div className="celebration my-4 text-2xl text-terminal-green-light animate-pulse">
                おめでとう！{rank}位入賞です！
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-xl mb-3">ランキング</h3>
              
              <div className="ranking-table-container overflow-x-auto">
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="border-b border-terminal-green">
                      <th className="py-2 px-4 text-left">順位</th>
                      <th className="py-2 px-4 text-right">スコア</th>
                      <th className="py-2 px-4 text-right">日付</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.slice(0, 5).map((score, index) => {
                      const isCurrentScore = score.score === currentScore && score.date === scores.find(s => s.score === currentScore)?.date;
                      const rowClass = `${index < 3 ? 'font-bold' : ''} ${isCurrentScore ? 'bg-terminal-green-dark bg-opacity-30' : ''}`;
                      
                      return (
                        <tr key={index} className={rowClass}>
                          <td className="py-2 px-4 text-left">{index + 1}</td>
                          <td className="py-2 px-4 text-right">{score.score}点</td>
                          <td className="py-2 px-4 text-right">
                            {formatDate(score.date)}
                            {isCurrentScore && <span className="ml-2">← あなた</span>}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {scores.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-4 text-center">まだスコアがありません</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-terminal-green-dark text-terminal-green-light border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-black transition-colors"
            >
              もう一度プレイ
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
