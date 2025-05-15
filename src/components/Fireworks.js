import React, { useEffect, useState } from 'react';
import '../styles/Fireworks.css';

const Fireworks = ({ show }) => {
  const [fireworks, setFireworks] = useState([]);
  
  useEffect(() => {
    if (!show) {
      setFireworks([]);
      return;
    }
    
    // 花火を追加するタイマー
    const interval = setInterval(() => {
      // ランダムな位置に花火を生成
      const newFirework = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: 10 + Math.random() * 30,
      };
      
      setFireworks(prev => [...prev, newFirework]);
      
      // 30個以上になったら古いものから削除
      if (fireworks.length > 30) {
        setFireworks(prev => prev.slice(1));
      }
    }, 200); // より頻繁に花火を表示
    
    // 初期表示時に花火をいくつか表示
    const initialFireworks = [];
    for (let i = 0; i < 10; i++) {
      initialFireworks.push({
        id: Date.now() + i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: 10 + Math.random() * 30,
      });
    }
    setFireworks(initialFireworks);
    
    return () => {
      clearInterval(interval);
      setFireworks([]);
    };
  }, [show]); // fireworks.lengthを依存配列から削除して無限ループを防止
  
  if (!show) return null;
  
  return (
    <div className="fireworks-container">
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="firework"
          style={{
            left: `${firework.left}%`,
            top: `${firework.top}%`,
            '--size': `${firework.size}px`,
            '--color': firework.color,
          }}
        />
      ))}
    </div>
  );
};

export default Fireworks; 