import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { 
  PenTool, BarChart3, List as ListIcon, ShieldAlert,
  Smile, Frown, Meh, Heart, Zap, Clock, CheckCircle2, Activity,
  Moon, Sun, Loader2, BedDouble, Sparkles, BrainCircuit, Compass, Bot, Lightbulb,
  Crown, MapPin, Dumbbell, Wind, Target, Briefcase, Plus, Trash2
} from 'lucide-react';

const robotPhrases = [
  "「あ、はい、分かりました（スッ…）」",
  "「確認して、後ほど対応します（無表情）」",
  "「貴重なご意見ありがとうございます（心はシャットダウン）」",
  "「規定により、そのような対応となります（ロボットボイス）」",
  "「承知いたしました（帰って何しようかな）」"
];

const philosophicalQuestions = [
  "今、頭の中のメモリを占領している『どうでもいい事』は何？",
  "今日、AIに任せられそうな作業はあった？",
  "今、あなたが本当にコントロールできるものは何？"
];

const rolandQuestions = [
  "世の中には2種類の男しかいない。俺か、俺以外か。今日、お前はどっちだ？",
  "シャワーを浴びる時、俺はオーラから洗う。お前は今日、何を磨いた？",
  "自信を持てとは言わない。俺の背中を見ろ、と言いたい。今の調子はどうだ？"
];

// ★ 筋トレとバイクを追加！
const locationTags = ["🏠 自宅", "☕️ カフェ", "💪 部屋で筋トレ", "🏍️ バイクで流す", "🚶‍♂️ 夜散歩"];

export default function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isRolandMode, setIsRolandMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  // --- 入力フォーム用（表用） ---
  const [mood, setMood] = useState(3);
  const [condition, setCondition] = useState(50);
  const [progress, setProgress] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [sleep, setSleep] = useState(7); 
  const [sleepQuality, setSleepQuality] = useState(50);
  const [exerciseDeficiency, setExerciseDeficiency] = useState(50); 
  const [brainClarity, setBrainClarity] = useState(50); 
  const [location, setLocation] = useState(''); 
  const [selfishness, setSelfishness] = useState(80); 
  const [reflection, setReflection] = useState(''); 
  
  // --- 入力フォーム用（裏用） ---
  const [humanAnnoyance, setHumanAnnoyance] = useState(50);
  const [blameScale, setBlameScale] = useState(50);
  const [note, setNote] = useState(''); 
  
  const [guidingStarFront, setGuidingStarFront] = useState("とにかく心身ともに健康でいる");
  const [guidingStarBack, setGuidingStarBack] = useState("自分の利益と平和が最優先。他人は知らん。");
  const [isEditingStar, setIsEditingStar] = useState(false);
  
  const [randomPhrase, setRandomPhrase] = useState(robotPhrases[0]);
  const [dailyQuestion, setDailyQuestion] = useState("");

  useEffect(() => {
    const savedEntries = localStorage.getItem('kokoro_entries_v4');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedProjects = localStorage.getItem('kokoro_projects_v2');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // ★ 初期プロジェクトをユーザーの目標に合わせたサンプルに変更
      setProjects([
        {
          id: '1',
          title: '🤖 仕事AI自動化プロジェクト',
          progress: 5,
          currentDissatisfaction: '自分がやらなくてもいい作業に時間を奪われている。',
          nextHope: 'AIエージェントに雑務を丸投げして、俺は楽をする。',
          tasks: [{ id: 't1', text: '今の業務で自動化できそうなリストを作る', done: false }]
        },
        {
          id: '2',
          title: '🏠 一人暮らし（完全な自由）計画',
          progress: 10,
          currentDissatisfaction: '引きこもりがちで他人の目が気になる。干渉されたくない。',
          nextHope: '誰にも邪魔されない、俺ルールだけで生きていける空間の確保。',
          tasks: [{ id: 't3', text: '月々の最低必要コストを計算してみる', done: false }]
        }
      ]);
    }

    const savedStarF = localStorage.getItem('kokoro_star_front');
    if (savedStarF) setGuidingStarFront(savedStarF);
    const savedStarB = localStorage.getItem('kokoro_star_back');
    if (savedStarB) setGuidingStarBack(savedStarB);
    const savedRoland = localStorage.getItem('kokoro_roland_mode');
    if (savedRoland === 'true') setIsRolandMode(true);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isRolandMode) {
      setDailyQuestion(rolandQuestions[Math.floor(Math.random() * rolandQuestions.length)]);
    } else {
      setDailyQuestion(philosophicalQuestions[Math.floor(Math.random() * philosophicalQuestions.length)]);
    }
  }, [isRolandMode, activeTab]);

  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  const saveProjectsToLocal = (newProjects) => {
    setProjects(newProjects);
    localStorage.setItem('kokoro_projects_v2', JSON.stringify(newProjects));
  };

  const handleSecretTap = () => {
    setTapCount(prev => prev + 1);
    if (tapCount + 1 >= 3) {
      setIsSecretMode(!isSecretMode);
      setTapCount(0);
      if(activeTab === 'projects') setActiveTab('input');
    }
    setTimeout(() => setTapCount(0), 1000);
  };

  const toggleRolandMode = () => {
    const newMode = !isRolandMode;
    setIsRolandMode(newMode);
    localStorage.setItem('kokoro_roland_mode', String(newMode));
  };

  const handleSaveGuidingStar = () => {
    if (isSecretMode) {
      localStorage.setItem('kokoro_star_back', guidingStarBack);
    } else {
      localStorage.setItem('kokoro_star_front', guidingStarFront);
    }
    setIsEditingStar(false);
  };

  const handleSave = () => {
    const now = new Date();
    const newEntry = {
      id: now.getTime().toString(),
      date: now.toISOString(),
      displayDate: `${now.getMonth() + 1}/${now.getDate()}`,
      displayTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      mood, 
      condition, 
      isSecret: isSecretMode,
      ...(isSecretMode 
        ? { humanAnnoyance, blameScale, note } 
        : { progress, speed, sleep, sleepQuality, exerciseDeficiency, brainClarity, location, selfishness, reflection, isRoland: isRolandMode } 
      )
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('kokoro_entries_v4', JSON.stringify(updatedEntries));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    if (isSecretMode) {
      setNote('');
    } else {
      setReflection('');
    }
  };

  const generateRobotPhrase = () => setRandomPhrase(robotPhrases[Math.floor(Math.random() * robotPhrases.length)]);

  const getMoodIcon = (level, size = 24) => {
    if (level >= 5) return <Smile size={size} className={isRolandMode ? "text-yellow-400" : "text-orange-500"} />;
    if (level === 4) return <Smile size={size} className="text-yellow-500" />;
    if (level === 3) return <Meh size={size} className="text-green-500" />;
    if (level === 2) return <Frown size={size} className="text-blue-500" />;
    return <Frown size={size} className="text-indigo-500" />;
  };

  const chartTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const chartGridColor = isDarkMode ? '#374151' : '#f3f4f6';
  const tooltipBgColor = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950' : 'bg-stone-50'}`}>
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  }

  const renderProjects = () => {
    const addNewProject = () => {
      const newProj = {
        id: Date.now().toString(),
        title: '新規プロジェクト',
        progress: 0,
        currentDissatisfaction: '',
        nextHope: '',
        tasks: []
      };
      saveProjectsToLocal([newProj, ...projects]);
    };

    const updateProject = (id, field, value) => {
      const updated = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
      saveProjectsToLocal(updated);
    };

    const deleteProject = (id) => {
      if(window.confirm('このプロジェクトを削除しますか？')) {
        saveProjectsToLocal(projects.filter(p => p.id !== id));
      }
    };

    const addTask = (projectId) => {
      const updated = projects.map(p => {
        if (p.id === projectId) {
          return { ...p, tasks: [...p.tasks, { id: Date.now().toString(), text: '', done: false }] };
        }
        return p;
      });
      saveProjectsToLocal(updated);
    };

    const updateTask = (projectId, taskId, field, value) => {
      const updated = projects.map(p => {
        if (p.id === projectId) {
          const newTasks = p.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
          return { ...p, tasks: newTasks };
        }
        return p;
      });
      saveProjectsToLocal(updated);
    };

    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Target className="text-emerald-500" /> マイプロジェクト
          </h2>
          <button onClick={addNewProject} className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-200">
            <Plus size={20} />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-500">プロジェクトがありません。<br/>右上の＋ボタンから追加しましょう！</div>
        ) : (
          projects.map(proj => (
            <div key={proj.id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-emerald-50 dark:border-gray-700 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <input 
                  type="text" value={proj.title} onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                  className="font-bold text-lg bg-transparent border-b border-transparent focus:border-emerald-300 outline-none text-gray-800 dark:text-gray-100 w-full transition-colors"
                  placeholder="プロジェクト名"
                />
                <button onClick={() => deleteProject(proj.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>進捗状況</span><span>{proj.progress}%</span>
                </div>
                <input type="range" min="0" max="100" value={proj.progress} onChange={(e) => updateProject(proj.id, 'progress', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-emerald-500" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                  <label className="text-xs font-bold text-red-600 dark:text-red-400 mb-1 block">今の不満・クソな所 (モチベ源)</label>
                  <textarea value={proj.currentDissatisfaction} onChange={(e) => updateProject(proj.id, 'currentDissatisfaction', e.target.value)} className="w-full bg-transparent border-none text-sm outline-none resize-none h-16 text-gray-700 dark:text-gray-300" placeholder="書き出してスッキリしよう" />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <label className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 block">次の絶対条件・希望 (北極星)</label>
                  <textarea value={proj.nextHope} onChange={(e) => updateProject(proj.id, 'nextHope', e.target.value)} className="w-full bg-transparent border-none text-sm outline-none resize-none h-16 text-gray-700 dark:text-gray-300" placeholder="妥協しない条件は？" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between mb-2">
                  <span>タスク / 次のアクション</span>
                  <button onClick={() => addTask(proj.id)} className="text-emerald-500 flex items-center gap-1"><Plus size={12}/> 追加</button>
                </label>
                <div className="space-y-2">
                  {proj.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={task.done} onChange={(e) => updateTask(proj.id, task.id, 'done', e.target.checked)} className="w-4 h-4 accent-emerald-500 rounded" />
                      <input type="text" value={task.text} onChange={(e) => updateTask(proj.id, task.id, 'text', e.target.value)} className={`flex-1 bg-transparent border-b border-gray-100 dark:border-gray-700 text-sm outline-none ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`} placeholder="タスクを入力" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    );
  };

  const renderFrontInput = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className={`p-4 rounded-2xl shadow-sm border ${isRolandMode ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700/50' : 'bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-100 dark:border-teal-800/50'}`}>
        <div className={`flex items-center gap-2 font-bold mb-2 ${isRolandMode ? 'text-yellow-700 dark:text-yellow-400' : 'text-teal-700 dark:text-teal-400'}`}>
          {isRolandMode ? <Crown size={18} /> : <Compass size={18} />}<span>{isRolandMode ? "俺の美学" : "私の北極星"}</span>
        </div>
        {isEditingStar ? (
          <div className="flex gap-2">
            <input value={guidingStarFront} onChange={(e) => setGuidingStarFront(e.target.value)} className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 rounded-lg border outline-none" />
            <button onClick={handleSaveGuidingStar} className={`text-white px-3 py-1 text-sm rounded-lg font-bold ${isRolandMode ? 'bg-yellow-600' : 'bg-teal-500'}`}>完了</button>
          </div>
        ) : (
          <div onClick={() => setIsEditingStar(true)} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            「{guidingStarFront}」 <span className="text-xs text-gray-400 ml-1">(変更)</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-orange-50 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-4"><Heart size={20} className={isRolandMode ? "text-yellow-400" : "text-orange-400"} /> {isRolandMode ? "今の俺のオーラ" : "今の気分"}</label>
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button key={level} onClick={() => setMood(level)} className={`p-3 rounded-full transition-all ${mood === level ? (isRolandMode ? 'bg-yellow-100 dark:bg-yellow-900/50 scale-110' : 'bg-orange-100 dark:bg-gray-700 scale-110') : 'grayscale opacity-50'}`}>{getMoodIcon(level, 32)}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-pink-50 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2">
          <Crown size={20} className="text-pink-400" /> {isRolandMode ? "唯我独尊メーター" : "自分ファースト（自己中）度"} <span className="ml-auto text-sm text-gray-400">{selfishness}%</span>
        </label>
        <input type="range" min="0" max="100" value={selfishness} onChange={(e) => setSelfishness(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-pink-500 mt-2" />
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span>他人に振り回された</span><span>完全俺様ペース</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-3">
          <MapPin size={20} className="text-emerald-500" /> {isRolandMode ? "帝王の現在地" : "今いる思考の空間"}
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {locationTags.map(tag => (
            <button key={tag} onClick={() => setLocation(tag)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${location === tag ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-600'}`}>{tag}</button>
          ))}
        </div>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="場所や環境を自由に入力" className="w-full bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-sm outline-none" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-cyan-50 dark:border-gray-700 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2"><Wind size={20} className="text-cyan-400" /> {isRolandMode ? "脳のキレ" : "頭のクリアさ（ブレインフォグ）"} <span className="ml-auto text-sm text-gray-400">{brainClarity}%</span></label>
          <input type="range" min="0" max="100" value={brainClarity} onChange={(e) => setBrainClarity(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-cyan-500 mt-2" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2"><Dumbbell size={20} className="text-rose-400" /> {isRolandMode ? "肉体のナマり具合" : "感覚的な運動不足感"} <span className="ml-auto text-sm text-gray-400">{exerciseDeficiency}%</span></label>
          <input type="range" min="0" max="100" value={exerciseDeficiency} onChange={(e) => setExerciseDeficiency(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-rose-500 mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-blue-50 dark:border-gray-700">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm font-medium mb-2"><Zap size={16} className="text-blue-400" /> エナジー</label>
          <input type="range" min="0" max="100" value={condition} onChange={(e) => setCondition(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-blue-500" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-purple-50 dark:border-gray-700">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm font-medium mb-2"><Clock size={16} className="text-purple-400" /> スピード</label>
          <input type="range" min="0" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-purple-500" />
        </div>
      </div>

      {/* 思考のパーキングロット（一時駐車場） */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-3">
          <BrainCircuit size={20} className={isRolandMode ? "text-yellow-500" : "text-teal-500"} /> 
          {isRolandMode ? "帝王の哲学" : "思考のパーキングロット（退避場所）"}
        </label>
        <div className={`mb-3 flex gap-2 items-start text-sm p-3 rounded-xl border-l-4 ${isRolandMode ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-gray-50 dark:bg-gray-900/40 border-teal-400'}`}>
          <Lightbulb size={16} className={`mt-0.5 flex-shrink-0 ${isRolandMode ? 'text-yellow-500' : 'text-teal-500'}`} />
          <p className="text-gray-600 dark:text-gray-300 italic">{dailyQuestion}</p>
        </div>
        <textarea 
          value={reflection} 
          onChange={(e) => setReflection(e.target.value)} 
          placeholder={isRolandMode ? "世界に響かせる言葉を..." : "作業中に急に浮かんだ邪魔な思考や、今の気持ちをここに吐き出して脳を空っぽにしよう！"} 
          className="w-full bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 border-none rounded-xl p-4 text-sm outline-none resize-none h-24" 
        />
      </div>
    </div>
  );

  // --- 裏の入力 ---
  const renderBackInput = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-800/50">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
          <Compass size={18} /><span>俺の絶対的ルール（北極星）</span>
        </div>
        {isEditingStar ? (
          <div className="flex gap-2">
            <input value={guidingStarBack} onChange={(e) => setGuidingStarBack(e.target.value)} className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 rounded-lg border outline-none" />
            <button onClick={handleSaveGuidingStar} className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg font-bold">完了</button>
          </div>
        ) : (
          <div onClick={() => setIsEditingStar(true)} className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            「{guidingStarBack}」 <span className="text-xs text-gray-400 ml-1">(変更)</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-red-50 dark:border-red-900/30 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2"><ShieldAlert size={20} className="text-red-400" /> 人間うざい度 <span className="ml-auto font-bold text-red-500">{humanAnnoyance}%</span></label>
          <input type="range" min="0" max="100" value={humanAnnoyance} onChange={(e) => setHumanAnnoyance(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-red-500 mt-2" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2"><BrainCircuit size={20} className="text-purple-400" /> 感情のバランス</label>
          <input type="range" min="0" max="100" value={blameScale} onChange={(e) => setBlameScale(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-purple-500 mt-2" />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span className={blameScale < 30 ? "text-blue-500" : ""}>自己嫌悪</span>
            <span className={blameScale > 70 ? "text-red-500" : ""}>あいつがうざい</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-800">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-3"><Bot size={20} className="text-gray-500" /> ロボット防衛モード</label>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 mb-3 text-center font-mono">{randomPhrase}</div>
        <button onClick={generateRobotPhrase} className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-700 dark:text-gray-300 py-2 rounded-xl text-sm font-bold">別の定型文を装填</button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-3"><PenTool size={20} className="text-red-500" /> 本音ダンプ</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="あいつマジでうざい..." className="w-full bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 border-none rounded-xl p-4 text-sm outline-none resize-none h-32" />
      </div>
    </div>
  );

  const renderDashboard = () => {
    const filteredEntries = entries.filter(e => isSecretMode ? e.isSecret : !e.isSecret);
    if (filteredEntries.length === 0) return <div className="p-8 flex items-center justify-center h-full"><p className="text-gray-500">まだデータがありません</p></div>;
    const graphData = [...filteredEntries].reverse();

    return (
      <div className="p-4 space-y-6 animate-in fade-in pb-24">
        {isSecretMode ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2"><ShieldAlert size={16} className="text-red-400" />人間うざい度 と 気分</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} hide />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                    <Line yAxisId="right" type="monotone" dataKey="mood" name="気分(1-5)" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="humanAnnoyance" name="人間うざい度" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2"><BrainCircuit size={16} className="text-purple-400" />自己嫌悪 vs 他責の波</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                    <ReferenceLine y={50} stroke={chartGridColor} strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="blameScale" name="他責寄り(上) / 自責(下)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2"><Crown size={16} className="text-pink-400" />自己中度 と 気分</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} hide />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                    <Line yAxisId="right" type="monotone" dataKey="mood" name="気分(1-5)" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="selfishness" name="自分ファースト度" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2"><Wind size={16} className="text-cyan-400" />脳のクリアさ vs 運動不足</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                    <Line type="monotone" dataKey="brainClarity" name="頭のクリアさ" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="exerciseDeficiency" name="運動不足感" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const filteredEntries = entries.filter(e => isSecretMode ? e.isSecret : !e.isSecret);
    if (filteredEntries.length === 0) return <div className="p-8 flex items-center justify-center h-full"><p className="text-gray-500">まだ記録がありません</p></div>;

    return (
      <div className="p-4 space-y-4 animate-in fade-in pb-24">
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex gap-4 items-start">
                <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-full flex-shrink-0">
                  {getMoodIcon(entry.mood, 28)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Clock size={14} className="text-orange-400"/> {entry.displayDate} {entry.displayTime || ''}
                    </span>
                    {entry.location && (
                      <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                        <MapPin size={10} /> {entry.location}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {!entry.isSecret && (
                      <>
                        {entry.selfishness !== undefined && <span className="text-xs font-medium bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-1 rounded-md">俺様度 {entry.selfishness}%</span>}
                        {entry.brainClarity !== undefined && <span className="text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded-md">脳クリア {entry.brainClarity}%</span>}
                        {entry.isRoland && <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-md flex items-center gap-1"><Crown size={12}/> 帝王モード</span>}
                      </>
                    )}
                    {entry.isSecret && (
                      <span className="text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">人間うざい度 {entry.humanAnnoyance}%</span>
                    )}
                  </div>
                </div>
              </div>

              {(entry.note || entry.reflection) && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex gap-2 items-start text-sm text-gray-600 dark:text-gray-300">
                    <PenTool size={16} className={`${entry.isSecret ? 'text-red-400' : (entry.isRoland ? 'text-yellow-500' : 'text-teal-400')} mt-0.5 flex-shrink-0`} />
                    <p className="whitespace-pre-wrap leading-relaxed">{entry.note || entry.reflection}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans flex justify-center transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950' : 'bg-stone-50'}`}>
      <div className="w-full max-w-md bg-stone-50 dark:bg-gray-900 h-screen flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
        
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md pt-6 pb-4 px-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
          <h1 
            onClick={handleSecretTap}
            className={`text-xl font-extrabold bg-gradient-to-r ${isSecretMode ? 'from-red-500 to-orange-500' : (isRolandMode ? 'from-yellow-400 to-amber-600' : 'from-orange-500 to-pink-500')} bg-clip-text text-transparent flex items-center gap-2 cursor-pointer select-none`}
          >
            {isSecretMode ? <ShieldAlert size={24} className="text-red-500" /> : (isRolandMode ? <Crown size={24} className="text-yellow-500" /> : <Activity size={24} className="text-orange-500" />)}
            {isSecretMode ? 'ココロとキロク (裏)' : (isRolandMode ? '帝王のキロク' : 'ココロとキロク')}
          </h1>
          
          <div className="flex items-center gap-2">
            {!isSecretMode && (
              <button onClick={toggleRolandMode} className={`p-2 rounded-full transition-colors ${isRolandMode ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'}`}>
                <Crown size={20} />
              </button>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'input' && (isSecretMode ? renderBackInput() : renderFrontInput())}
          {activeTab === 'projects' && !isSecretMode && renderProjects()}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'history' && renderHistory()}
          
          {activeTab === 'input' && (
            <div className="px-4 pb-4">
              <button 
                onClick={handleSave} 
                className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 mt-4 
                  ${isSecretMode ? 'bg-red-500 hover:bg-red-600' : (isRolandMode ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700' : 'bg-orange-500 hover:bg-orange-600')}`}
              >
                {isSecretMode ? <ShieldAlert size={20} /> : (isRolandMode ? <Crown size={20} /> : <Activity size={20} />)}
                {isSecretMode ? '本音を封印する' : (isRolandMode ? '歴史を刻む' : '状態を記録する')}
              </button>
            </div>
          )}
        </main>

        {showToast && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in z-50 whitespace-nowrap">
            <CheckCircle2 size={18} className={isSecretMode ? "text-red-400" : (isRolandMode ? "text-yellow-400" : "text-green-400")} />
            記録しました！
          </div>
        )}

        <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 transition-colors">
          <div className="flex justify-around items-center h-16 px-1">
            <button onClick={() => setActiveTab('input')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'input' ? (isSecretMode ? 'text-red-500' : (isRolandMode ? 'text-yellow-600' : 'text-orange-500')) : 'text-gray-400'}`}>
              <PenTool size={20} className={activeTab === 'input' ? (isSecretMode ? 'fill-red-900/50' : (isRolandMode ? 'fill-yellow-900/50' : 'fill-orange-100 dark:fill-orange-900/50')) : ''} />
              <span className="text-[10px] font-bold">記録</span>
            </button>
            
            {!isSecretMode && (
              <button onClick={() => setActiveTab('projects')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'projects' ? 'text-emerald-500' : 'text-gray-400'}`}>
                <Briefcase size={20} className={activeTab === 'projects' ? 'fill-emerald-100 dark:fill-emerald-900/50' : ''} />
                <span className="text-[10px] font-bold">進行中</span>
              </button>
            )}

            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-gray-400'}`}>
              <BarChart3 size={20} className={activeTab === 'dashboard' ? 'fill-blue-100 dark:fill-blue-900/50' : ''} />
              <span className="text-[10px] font-bold">データ</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'history' ? (isSecretMode ? 'text-purple-500' : 'text-green-500') : 'text-gray-400'}`}>
              <ListIcon size={20} className={activeTab === 'history' ? (isSecretMode ? 'fill-purple-900/50' : 'fill-green-100 dark:fill-green-900/50') : ''} />
              <span className="text-[10px] font-bold">履歴</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
