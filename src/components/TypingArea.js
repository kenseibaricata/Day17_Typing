import React, { useEffect } from 'react';

const TypingArea = ({ input, onInputChange, isGameActive, inputRef, expectedInput, japaneseWord, inputMode = 'romaji' }) => {
  // 半角英語入力モードに切り替えるための効果
  useEffect(() => {
    if (!inputRef.current) return;
    
    // inputRef.currentの参照を保存しておく
    const inputElement = inputRef.current;
    
    // 半角英語入力モードを強制するためのフォーカス時の処理
    const setEnglishInput = () => {
      inputElement.setAttribute('lang', 'en');
      inputElement.setAttribute('inputmode', 'latin');
      inputElement.setAttribute('autocomplete', 'off');
      inputElement.setAttribute('autocorrect', 'off');
      inputElement.setAttribute('autocapitalize', 'off');
      inputElement.setAttribute('spellcheck', 'false');
      
      // IMEを無効化
      inputElement.style.imeMode = 'disabled';
    };
    
    inputElement.addEventListener('focus', setEnglishInput);
    setEnglishInput(); // 初期表示時にも適用
    
    return () => {
      // クリーンアップ時には保存しておいた参照を使用
      inputElement.removeEventListener('focus', setEnglishInput);
    };
  }, [inputRef]);

  // 入力文字のハイライト表示（ローマ字のみ対応）

  // 入力文字のハイライト表示（日本語モード用）
  const renderJapaneseHint = () => {
    // 入力された文字に応じたクラスを適用
    let className = "";
    
    if (input === expectedInput) {
      className = "text-terminal-green"; // 完全一致
    } else if (expectedInput.startsWith(input)) {
      className = "text-terminal-green-light"; // 途中まで一致
    } else {
      className = "text-red-500"; // 不一致
    }
    
    return (
      <div className={className}>
        {expectedInput}
      </div>
    );
  };

  // ローマ字モード用の文字ごとのハイライト
  const renderRomajiHint = () => {
    return expectedInput.split('').map((char, index) => {
      let className = "text-terminal-green-dark"; // デフォルト色
      
      if (index < input.length) {
        // 入力済みの文字
        className = input[index] === char 
          ? "text-terminal-green" // 正解
          : "text-red-500"; // 不正解
      } else if (index === input.length) {
        className = "text-terminal-green-light underline"; // 次に入力する文字
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // ヒント表示を選択
  const renderHint = () => {
    if (inputMode === 'japanese') {
      return renderJapaneseHint();
    } else {
      return renderRomajiHint();
    }
  };

  // カスタムの入力ハンドラ - 半角英数のみ受け付ける
  const handleInputChange = (e) => {
    // 半角英数のみを許可する正規表現
    const asciiRegex = /^[a-zA-Z0-9-]*$/;
    const value = e.target.value;
    
    // 空の場合または全て半角英数の場合のみ更新
    if (value === '' || asciiRegex.test(value)) {
      onInputChange(e);
    }
  };

  return (
    <div className="typing-area w-full">
      <div className="word-display flex flex-col items-center mb-6">
        <div className="japanese-text text-4xl mb-2">
          {japaneseWord}
        </div>
        
        {/* 進捗状況を単語の真下に表示 */}
        <div className="hint-text text-2xl mb-4">
          {renderHint()}
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        disabled={!isGameActive}
        className="w-full bg-white border-2 border-terminal-green text-black p-6 text-2xl rounded focus:outline-none focus:border-terminal-green-light"
        placeholder="ここに半角英字で入力してください..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        lang="ja"
        inputMode="text"
      />
      
      <div className="text-lg mt-3 text-terminal-green-dark">
        入力：{input}
      </div>
    </div>
  );
};

export default TypingArea; 