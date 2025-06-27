
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Problem, Operation, GamePhase, ThemeColors } from './types';
import { PROBLEMS_PER_LEVEL, INITIAL_LEVEL, INITIAL_SCORE, INITIAL_STREAK, getRandomInt, LEVEL_THEMES, CHARACTER_IMAGES, MAX_LEVELS } from './constants';
import ActionButton from './components/ActionButton';

// Helper for SVG icons
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75l-1.25-1.75L14.25 12l1.5-1.75L17 8.25l1.25 1.75L19.75 12zM9.813 15.904L9 18.75l-.813-2.846m0-6.092L5.25 9l.813-2.846M15.75 12l-2.846-.813m0 0L12 5.25l.813 2.846m0 6.092L15 18.75l-.813-2.846M18.25 12L17 13.75l-1.25-1.75M17 8.25l1.25 1.75L19.75 12l-1.5 1.75M9 5.25l.813 2.846" /></svg>;
const NextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>;


const App: React.FC = () => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [level, setLevel] = useState<number>(INITIAL_LEVEL);
  const [streak, setStreak] = useState<number>(INITIAL_STREAK);
  const [problemsSolvedThisLevel, setProblemsSolvedThisLevel] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('START');
  const [animateFeedback, setAnimateFeedback] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextActionButtonRef = useRef<HTMLButtonElement>(null);


  const currentTheme = LEVEL_THEMES[level] || LEVEL_THEMES[1];
  const characterImageName = CHARACTER_IMAGES[level] || CHARACTER_IMAGES[1];
  const characterImageUrl = `https://picsum.photos/seed/${characterImageName}_${level}/150/150`;

  const generateProblem = useCallback((currentLvl: number): Problem => {
    let num1: number, num2: number, answer: number;
    const operationTypes = [Operation.ADD, Operation.SUBTRACT, Operation.MULTIPLY, Operation.DIVIDE];
    const selectedOperation = operationTypes[getRandomInt(0, operationTypes.length - 1)];
    let operationSymbol = '';
    let questionText = '';

    switch (selectedOperation) {
      case Operation.ADD:
        operationSymbol = '+';
        if (currentLvl === 1) { num1 = getRandomInt(1, 20); num2 = getRandomInt(1, 20); } 
        else if (currentLvl === 2) { num1 = getRandomInt(10, 50); num2 = getRandomInt(10, 50); } 
        else { num1 = getRandomInt(50, 200); num2 = getRandomInt(50, 200); }
        answer = num1 + num2;
        break;
      case Operation.SUBTRACT:
        operationSymbol = '-';
        if (currentLvl === 1) { num1 = getRandomInt(10, 30); num2 = getRandomInt(1, num1 -1); } 
        else if (currentLvl === 2) { num1 = getRandomInt(20, 100); num2 = getRandomInt(10, num1 -1); } 
        else { num1 = getRandomInt(100, 300); num2 = getRandomInt(50, num1 -1); }
        answer = num1 - num2;
        break;
      case Operation.MULTIPLY:
        operationSymbol = '×';
        if (currentLvl === 1) { num1 = getRandomInt(1, 9); num2 = getRandomInt(1, 9); } 
        else if (currentLvl === 2) { num1 = getRandomInt(2, 9); num2 = getRandomInt(10, 15); if(Math.random() > 0.5) [num1,num2] = [num2,num1]; } // Swap to vary
        else { num1 = getRandomInt(2, 9); num2 = getRandomInt(10, 25); if(Math.random() > 0.5) [num1,num2] = [num2,num1];}
        answer = num1 * num2;
        break;
      case Operation.DIVIDE:
      default: // Default to division if something goes wrong
        operationSymbol = '÷';
        if (currentLvl === 1) { answer = getRandomInt(2, 9); num2 = getRandomInt(2, 9); } 
        else if (currentLvl === 2) { answer = getRandomInt(2, 12); num2 = getRandomInt(2, 9); } 
        else { answer = getRandomInt(5, 15); num2 = getRandomInt(3, 9); }
        num1 = answer * num2;
        break;
    }
    questionText = `${num1} ${operationSymbol} ${num2} = ?`;
    return { num1, num2, operation: selectedOperation, operationSymbol, answer, questionText };
  }, []);

  useEffect(() => {
    if (gamePhase === 'PLAYING' && inputRef.current) {
      inputRef.current.focus();
    } else if ((gamePhase === 'FEEDBACK' || gamePhase === 'LEVEL_UP') && nextActionButtonRef.current) {
        // Ensure the "next" button can be focused for accessibility,
        // but primary interaction for Enter key is handled by the global listener.
        // nextActionButtonRef.current.focus(); 
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === 'START' || (gamePhase === 'PLAYING' && !currentProblem)) {
      setCurrentProblem(generateProblem(level));
    }
  }, [gamePhase, currentProblem, generateProblem, level]);

  useEffect(() => {
    if (feedbackMessage) {
      setAnimateFeedback(true);
      const timer = setTimeout(() => setAnimateFeedback(false), 500); // Duration of animation
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleAnswerSubmit = () => {
    if (!currentProblem || userAnswer.trim() === '') return;
    const answerNum = parseInt(userAnswer, 10);
    setAnimateFeedback(false); // Reset animation state before new feedback

    if (answerNum === currentProblem.answer) {
      setFeedbackMessage('せいかい！すごいね！ 🎉');
      setIsCorrect(true);
      setScore(prevScore => prevScore + 10 + streak * 2); // Score + streak bonus
      setStreak(prevStreak => prevStreak + 1);
      setProblemsSolvedThisLevel(prev => prev + 1);
    } else {
      setFeedbackMessage(`ざんねん...こたえは ${currentProblem.answer} でした。 🤔`);
      setIsCorrect(false);
      setStreak(0); // Reset streak
    }
    setGamePhase('FEEDBACK');
  };

  const handleNextAction = useCallback(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setFeedbackMessage('');
    setAnimateFeedback(false);

    if (gamePhase === 'START') {
      setCurrentProblem(generateProblem(level));
      setGamePhase('PLAYING');
      return;
    }
    
    if (gamePhase === 'FEEDBACK') {
      if (isCorrect && problemsSolvedThisLevel >= PROBLEMS_PER_LEVEL) {
        if (level < MAX_LEVELS) {
            setGamePhase('LEVEL_UP');
            setFeedbackMessage(`レベル ${level + 1} にアップ！おめでとう！ 🚀`);
        } else {
            setGamePhase('PLAYING'); // Or a "Game Completed" state
            setFeedbackMessage('ぜんぶクリア！すごい！🏆 またあそんでね！');
             // Reset for potential replay at max level or restart
            setProblemsSolvedThisLevel(0);
            setCurrentProblem(generateProblem(level));
        }
      } else {
        setCurrentProblem(generateProblem(level));
        setGamePhase('PLAYING');
      }
    } else if (gamePhase === 'LEVEL_UP') {
      if (level < MAX_LEVELS) {
        setLevel(prevLevel => prevLevel + 1);
        setProblemsSolvedThisLevel(0);
        setCurrentProblem(generateProblem(level + 1));
      } else {
        setFeedbackMessage('ぜんぶクリア！すごい！🏆 またあそんでね！');
        setProblemsSolvedThisLevel(0); 
        setCurrentProblem(generateProblem(MAX_LEVELS));
      }
      setGamePhase('PLAYING');
    }
  }, [gamePhase, isCorrect, problemsSolvedThisLevel, level, generateProblem]);
  
  // Handle Enter key for "Next Action" during FEEDBACK or LEVEL_UP phase
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (gamePhase === 'FEEDBACK' || gamePhase === 'LEVEL_UP') {
          handleNextAction();
        }
      }
    };

    if (gamePhase === 'FEEDBACK' || gamePhase === 'LEVEL_UP') {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gamePhase, handleNextAction]);


  const getButtonInfo = () => {
    switch(gamePhase) {
      case 'START':
        return { text: "スタート！", onClick: handleNextAction, icon: <SparklesIcon />, className: `${currentTheme.button} ${currentTheme.buttonHover} focus:ring-blue-400`};
      case 'PLAYING':
        return { text: "こたえる", onClick: handleAnswerSubmit, icon: <CheckIcon />, className: `${currentTheme.button} ${currentTheme.buttonHover} focus:ring-green-400`};
      case 'FEEDBACK':
        return { text: "つぎのもんだいへ", onClick: handleNextAction, icon: <NextIcon/>, className: `${currentTheme.button} ${currentTheme.buttonHover} focus:ring-indigo-400`};
      case 'LEVEL_UP':
        return { text: `やったー！つぎへ！`, onClick: handleNextAction, icon: <SparklesIcon />, className: `bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400` };
      default:
        return { text: "...", onClick: () => {}, className: "bg-gray-400" };
    }
  };

  const buttonInfo = getButtonInfo();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`} role="application">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 text-center space-y-6 border-4 ${currentTheme.accent}">
        
        <header className="mb-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold ${currentTheme.text}">わくわく算数チャレンジ！</h1>
        </header>

        <div className="grid grid-cols-3 gap-2 text-sm md:text-lg font-semibold" aria-live="polite">
          <div className="bg-white/50 p-2 rounded-lg shadow"><span className="font-display">スコア:</span> {score}</div>
          <div className="bg-white/50 p-2 rounded-lg shadow"><span className="font-display">レベル:</span> {level}</div>
          <div className="bg-white/50 p-2 rounded-lg shadow"><span className="font-display">れんぞく正解:</span> {streak}回</div>
        </div>
        
        {gamePhase !== 'START' && currentProblem && (
          <div className="my-6 space-y-4">
            <div className={`p-4 rounded-lg shadow-inner ${currentTheme.bg === 'bg-blue-100' ? 'bg-blue-50' : currentTheme.bg === 'bg-green-100' ? 'bg-green-50' : currentTheme.bg === 'bg-purple-100' ? 'bg-purple-50' : currentTheme.bg === 'bg-pink-100' ? 'bg-pink-50' : 'bg-orange-50' }`}>
                 <img src={characterImageUrl} alt={`レベル${level}のかわいい${characterImageName}のキャラクター`} className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-white mb-4" />
                <p id="question-text" aria-live="polite" className={`font-display text-4xl md:text-5xl font-bold tracking-wider ${currentTheme.text}`}>
                {currentProblem.questionText.replace('?', '')}
                <span className="inline-block animate-pulse" aria-hidden="true">?</span>
                </p>
            </div>

            <input
              ref={inputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && gamePhase === 'PLAYING') {
                  handleAnswerSubmit();
                }
              }}
              placeholder="こたえを入力"
              aria-label="答えを入力する欄"
              aria-describedby="question-text"
              disabled={gamePhase !== 'PLAYING'}
              className={`w-full md:w-3/4 mx-auto p-3 text-2xl text-center font-bold border-2 ${currentTheme.accent} rounded-lg shadow-sm focus:ring-2 focus:ring-offset-1 ${currentTheme.accent.replace('border-', 'focus:ring-')} focus:outline-none disabled:bg-gray-200 disabled:cursor-not-allowed`}
            />
          </div>
        )}

        {feedbackMessage && (
          <div 
            role="alert" 
            aria-live="assertive" 
            className={`p-3 my-2 rounded-lg text-lg font-semibold shadow ${animateFeedback ? 'animate-fadeIn' : ''} ${ isCorrect === null ? 'bg-gray-100 text-gray-700' : isCorrect ? 'bg-brand-correct text-white animate-bounceIn' : 'bg-brand-incorrect text-white'}`}>
            {feedbackMessage}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <ActionButton 
            ref={nextActionButtonRef}
            onClick={buttonInfo.onClick} 
            text={buttonInfo.text}
            icon={buttonInfo.icon}
            className={buttonInfo.className}
            disabled={gamePhase === 'PLAYING' && userAnswer.trim() === ''}
          />
        </div>
        
        {gamePhase !== 'START' && (
            <div className="w-full h-3 bg-gray-200 rounded-full mt-6 overflow-hidden" aria-hidden="true">
                <div 
                    className={`h-full rounded-full ${currentTheme.button} transition-all duration-300 ease-linear`}
                    style={{ width: `${(problemsSolvedThisLevel / PROBLEMS_PER_LEVEL) * 100}%` }}
                ></div>
            </div>
        )}
        <p className="text-xs text-gray-500 mt-4" aria-live="polite">Lv.{level}クリアまで あと {Math.max(0, PROBLEMS_PER_LEVEL - problemsSolvedThisLevel)} もん！</p>

      </div>
       <footer className="text-center text-xs text-gray-600 py-4">
        &copy; 2025 わくわく算数プロジェクト
      </footer>
    </div>
  );
};

export default App;
