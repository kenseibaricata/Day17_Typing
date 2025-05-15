import React from 'react';

const Timer = ({ timeLeft, size = 'normal' }) => {
  // 残り時間が10秒以下の場合は警告カラーに変更
  const timerClass = timeLeft <= 10 
    ? "text-red-500 font-bold" 
    : "text-terminal-green";

  // サイズに応じたクラスを設定
  const sizeClass = size === 'large' 
    ? "text-3xl font-bold" 
    : "text-xl";

  return (
    <div className={`timer ${sizeClass} ${timerClass} text-right`}>
      残り時間: <span className={size === 'large' ? 'text-4xl' : ''}>{timeLeft}</span>秒
    </div>
  );
};

export default Timer; 