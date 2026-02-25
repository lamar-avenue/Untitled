import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, ChevronRight, Trophy, RotateCcw, Monitor, Smartphone, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';
import { AuraBackground } from './components/AuraBackground';
import { GlassCard } from './components/GlassCard';
import { questLevels, QuestLevel } from './data/questData';
import carImage from "@/assets/29b3a5a1b27405b58b2245be649f5942f9d7668f.png";

const KeyCharacter: React.FC<{ char: string | undefined; index: number }> = ({ char, index }) => {
  const [displayChar, setDisplayChar] = useState('?');
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  useEffect(() => {
    if (char) {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayChar(prev => 
          prev.split("")
            .map((_, i) => characters[Math.floor(Math.random() * characters.length)])
            .join("")
        );
        
        if (iteration >= 10) {
          clearInterval(interval);
          setDisplayChar(char);
        }
        iteration += 1;
      }, 50);
      return () => clearInterval(interval);
    } else {
      setDisplayChar('?');
    }
  }, [char]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-10 h-14 md:w-12 md:h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-500 group overflow-hidden ${
        char 
          ? 'bg-blue-500/10 border-blue-400/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
          : 'bg-white/5 border-white/5 text-white/10'
      }`}
    >
      {char && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-50" />
      )}
      <span className="relative z-10 font-mono font-bold text-xl md:text-2xl tracking-tighter">
        {displayChar}
      </span>
      {/* Scanning line effect */}
      {char && (
        <motion.div 
          animate={{ top: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(0); // 0 is start screen
  const [collectedKey, setCollectedKey] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true); // Default muted for better autoplay support
  const [showOptions, setShowOptions] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentLevelData = questLevels[currentLevel - 1];
  const progress = (currentLevel / questLevels.length) * 100;

  // Handle Level 3 Special Video Logic
  useEffect(() => {
    if (currentLevelData?.type === 'video') {
      setShowOptions(false);
      setVideoPaused(false);
      setVideoError(false);
    } else {
      setShowOptions(true);
    }
  }, [currentLevel]);

  const handleTimeUpdate = () => {
    if (videoRef.current && currentLevelData?.type === 'video' && !videoPaused) {
      if (videoRef.current.currentTime >= (currentLevelData.pauseTime || 5)) {
        videoRef.current.pause();
        setVideoPaused(true);
        setShowOptions(true);
      }
    }
  };

  const handleAnswer = (isCorrect: boolean, symbol: string) => {
    if (isCorrect) {
      toast.success('Верно! Символ получен.');
      setCollectedKey((prev) => [...prev, symbol]);
      
      if (currentLevelData?.type === 'video' && videoRef.current && !videoError) {
        setShowOptions(false);
        videoRef.current.play().catch(() => {
          // If play fails, just move to next level
          setTimeout(nextLevel, 1000);
        });
        videoRef.current.onended = () => {
          setTimeout(nextLevel, 1000);
        };
      } else {
        setTimeout(nextLevel, 1000);
      }
    } else {
      toast.error('Не совсем так, попробуй еще раз');
    }
  };

  const nextLevel = () => {
    if (currentLevel < questLevels.length) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#a855f7', '#2dd4bf']
      });
    }
  };

  const startQuest = () => {
    setCurrentLevel(1);
    setCollectedKey([]);
    setIsFinished(false);
  };

  const resetQuest = () => {
    setCurrentLevel(0);
    setCollectedKey([]);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30">
      <AuraBackground />
      <Toaster position="top-center" expand={false} richColors />

      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-sm border-b border-white/5">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            MARK QUEST
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
            Birthday Special Edition
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-blue-400 transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="sm:hidden">
             <Volume2 size={18} className="text-white/40" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-[68px] left-0 right-0 z-50 h-0.5 bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-purple-500 relative"
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
        </motion.div>
      </div>

      <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Start Screen */}
          {currentLevel === 0 && !isFinished && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center text-center min-h-[60vh] py-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-12 group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                  <img src={carImage} alt="Quest Start" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                С Днем Рождения, Марк!
              </h1>
              <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto leading-relaxed">
                Я подготовил для тебя небольшое испытание из 12 уровней. Собери все символы ключа, чтобы разблокировать свой подарок. Удачи!
              </p>
              <button
                onClick={startQuest}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Начать Квест <ChevronRight size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          )}

          {/* Quest Screen */}
          {currentLevel > 0 && !isFinished && (
            <motion.div
              key="quest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Task */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm font-semibold tracking-widest text-blue-400 uppercase">
                      {currentLevelData.title}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            i < currentLevel ? 'bg-blue-500' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug">
                    {currentLevelData.task}
                  </h2>

                  {currentLevelData.type === 'video' && (
                    <div className="relative aspect-video mb-10 rounded-xl overflow-hidden bg-black/40 border border-white/5 group">
                      {!videoError ? (
                        <video
                          ref={videoRef}
                          src={currentLevelData.videoUrl}
                          onTimeUpdate={handleTimeUpdate}
                          onError={() => {
                            setVideoError(true);
                            setShowOptions(true);
                          }}
                          className="w-full h-full object-cover"
                          playsInline
                          muted={isMuted}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm">
                           <AlertCircle size={40} className="text-white/20" />
                           <p className="text-white/40 text-sm">Видео временно недоступно, но квест продолжается!</p>
                        </div>
                      )}
                      
                      {!videoError && (
                        <>
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent opacity-50" />
                          {!videoPaused && (
                             <button 
                                onClick={() => {
                                    if(videoRef.current?.paused) videoRef.current.play();
                                    else videoRef.current?.pause();
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                    <Play size={32} />
                                </div>
                             </button>
                          )}
                          {videoPaused && (
                            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/20">
                               <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                                  <Pause size={12} /> Видео остановлено. Выбери ответ.
                               </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {currentLevelData.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleAnswer(opt.isCorrect, currentLevelData.keySymbol)}
                            className="group relative p-5 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
                          >
                            <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                            <div className="relative flex items-center justify-between">
                              <span className="font-medium text-white/90">{opt.text}</span>
                              <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(59,130,246,0)] group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </div>

              {/* Right Column: Key Progress */}
              <div className="lg:col-span-1">
                <GlassCard className="p-8 sticky top-32 overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                     <Monitor size={40} className="text-blue-500" />
                  </div>
                  
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    System Cipher
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </h3>
                  
                  <div className="relative">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] -z-10" />
                    
                    <div className="grid grid-cols-4 gap-3 py-2">
                      {[...Array(12)].map((_, i) => (
                        <KeyCharacter key={i} char={collectedKey[i]} index={i} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 space-y-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/30">Decrypting...</span>
                        <span className="text-blue-400/80">{Math.round((collectedKey.length / 12) * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(collectedKey.length / 12) * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-600 to-teal-400" 
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] leading-relaxed text-white/20 uppercase tracking-wider font-medium">
                        Secure connection established. All symbols are stored in a distributed encrypted ledger.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* Final Screen */}
          {isFinished && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12"
            >
              <GlassCard className="p-12 w-full">
                <div className="mb-8 flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full" />
                    <Trophy size={80} className="text-yellow-400 relative z-10" />
                  </motion.div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Миссия Выполнена!</h2>
                <p className="text-white/60 mb-10 leading-relaxed text-lg">
                  Ты успешно прошел все испытания и доказал свою гениальность. Вот твой ключ к подарку:
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 shadow-inner">
                   <div className="text-3xl md:text-5xl font-mono tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 animate-gradient">
                     {collectedKey.join('')}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button
                    onClick={resetQuest}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all"
                  >
                    <RotateCcw size={18} /> Пройти еще раз
                  </button>
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl font-bold shadow-[0_15px_30px_-10px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all"
                  >
                    Забрать Подарок
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      
      {/* Device Indicator (Visual Flavor) */}
      <div className="fixed bottom-6 left-6 flex items-center gap-3 text-white/20 text-[10px] uppercase tracking-widest font-bold hidden md:flex">
         <div className="flex gap-2">
            <Monitor size={12} />
            <Smartphone size={12} />
         </div>
         <div className="w-1 h-1 rounded-full bg-blue-500/50" />
         Encrypted Connection Active
      </div>
    </div>
  );
};

export default App;
