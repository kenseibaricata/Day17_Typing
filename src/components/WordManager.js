import React, { useState, useEffect } from 'react';

const WordManager = ({ isOpen, onClose }) => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', hiragana: '', romaji: '', score: 0 });
  const [editIndex, setEditIndex] = useState(-1);

  // 初期化時に単語データをロード
  useEffect(() => {
    const savedWords = localStorage.getItem('customPcWords');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    } else {
      // デフォルトのPC単語をインポートして初期値として使用
      import('../data/pcWords').then(module => {
        const defaultWords = module.default;
        setWords(defaultWords);
        localStorage.setItem('customPcWords', JSON.stringify(defaultWords));
      });
    }
  }, []);

  // 単語データの保存
  const saveWords = (updatedWords) => {
    localStorage.setItem('customPcWords', JSON.stringify(updatedWords));
    setWords(updatedWords);
  };

  // 単語の追加
  const addWord = () => {
    // スコアが単語の長さに基づいて自動計算
    const wordScore = newWord.word ? newWord.word.length : 0;
    const wordToAdd = { ...newWord, score: wordScore };
    
    const updatedWords = [...words, wordToAdd];
    saveWords(updatedWords);
    setNewWord({ word: '', hiragana: '', romaji: '', score: 0 });
  };

  // 単語の削除
  const removeWord = (index) => {
    const updatedWords = [...words];
    updatedWords.splice(index, 1);
    saveWords(updatedWords);
  };

  // 単語の編集開始
  const startEdit = (index) => {
    setEditIndex(index);
    setNewWord(words[index]);
  };

  // 単語の更新
  const updateWord = () => {
    if (editIndex >= 0) {
      const updatedWords = [...words];
      // スコアが単語の長さに基づいて自動計算
      const wordScore = newWord.word ? newWord.word.length : 0;
      updatedWords[editIndex] = { ...newWord, score: wordScore };
      saveWords(updatedWords);
      setEditIndex(-1);
      setNewWord({ word: '', hiragana: '', romaji: '', score: 0 });
    }
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditIndex(-1);
    setNewWord({ word: '', hiragana: '', romaji: '', score: 0 });
  };

  // 入力フォームの変更ハンドラ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWord({ ...newWord, [name]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-terminal-black border-2 border-terminal-green p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-terminal-green">タイピング単語の管理</h2>
        
        {/* 新規単語入力フォーム */}
        <div className="mb-8 border border-terminal-green p-4 rounded">
          <h3 className="text-xl mb-4 text-terminal-green">{editIndex >= 0 ? '単語を編集' : '新しい単語を追加'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-terminal-green">単語 (日本語)</label>
              <input
                type="text"
                name="word"
                value={newWord.word}
                onChange={handleInputChange}
                className="w-full bg-black border border-terminal-green text-terminal-green p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-terminal-green">ひらがな</label>
              <input
                type="text"
                name="hiragana"
                value={newWord.hiragana}
                onChange={handleInputChange}
                className="w-full bg-black border border-terminal-green text-terminal-green p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-terminal-green">ローマ字</label>
              <input
                type="text"
                name="romaji"
                value={newWord.romaji}
                onChange={handleInputChange}
                className="w-full bg-black border border-terminal-green text-terminal-green p-2 rounded"
              />
            </div>
          </div>
          {editIndex >= 0 ? (
            <div className="flex space-x-2">
              <button
                onClick={updateWord}
                className="px-4 py-2 bg-terminal-green-dark text-terminal-green-light border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-black"
              >
                更新
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-transparent text-terminal-green border border-terminal-green rounded hover:bg-terminal-green-dark"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={addWord}
              className="px-4 py-2 bg-terminal-green-dark text-terminal-green-light border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-black"
            >
              追加
            </button>
          )}
        </div>
        
        {/* 単語リスト */}
        <div className="overflow-auto">
          <h3 className="text-xl mb-4 text-terminal-green">登録済み単語 ({words.length}件)</h3>
          <table className="w-full text-terminal-green border-collapse">
            <thead>
              <tr className="border-b border-terminal-green">
                <th className="py-2 px-3 text-left">単語</th>
                <th className="py-2 px-3 text-left">ひらがな</th>
                <th className="py-2 px-3 text-left">ローマ字</th>
                <th className="py-2 px-3 text-center">スコア</th>
                <th className="py-2 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, index) => (
                <tr key={index} className="border-b border-terminal-green-dark">
                  <td className="py-2 px-3">{word.word}</td>
                  <td className="py-2 px-3">{word.hiragana}</td>
                  <td className="py-2 px-3">{word.romaji}</td>
                  <td className="py-2 px-3 text-center">{word.score}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => startEdit(index)}
                      className="px-2 py-1 mr-2 text-xs bg-transparent text-terminal-green border border-terminal-green rounded hover:bg-terminal-green-dark"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => removeWord(index)}
                      className="px-2 py-1 text-xs bg-transparent text-red-500 border border-red-500 rounded hover:bg-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              {words.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    単語が登録されていません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-terminal-green-dark text-terminal-green-light border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-black"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordManager; 