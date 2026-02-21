import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { 
  PenTool, BarChart3, List as ListIcon, ShieldAlert,
  Smile, Frown, Meh, Heart, Zap, Clock, CheckCircle2, Activity,
  Moon, Sun, Loader2, BedDouble, Sparkles, BrainCircuit, Compass, Bot, Lightbulb,
  Crown, MapPin, Dumbbell, Wind, Briefcase, Plus, Trash2, Download, Upload, MessageSquarePlus, AlertOctagon
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

const locationTags = ["🏠 自宅", "☕️ カフェ", "💪 部屋で筋トレ", "🏍️ バイクで流す", "🚶‍♂️ 夜散歩"];

export default function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [chartSpan, setChartSpan] = useState('all');

  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isRolandMode, setIsRolandMode] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const fileInputRef = useRef(null);

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
  
  const [humanAnnoyance, setHumanAnnoyance] = useState(50);
  const [blameScale, setBlameScale] = useState(50);
  const [note, setNote] = useState(''); 
  
  const [workIdeas, setWorkIdeas] = useState(""); 
  const [workDissatisfaction, setWorkDissatisfaction] = useState("無駄な人間関係。時間が縛られること。");
  const [workHope, setWorkHope] = useState("完全在宅。AIを活用して自分のペースで稼ぐ。");
  const [workTasks, setWorkTasks] = useState([
    { id: '1', text: 'クラウドワークスで良さげな案件を3つ探す', done: false },
    { id: '2', text: 'AIを使ってプロフィール文を考えてもらう', done: false }
  ]);
  
  const [guidingStarFront, setGuidingStarFront] = useState("とにかく心身ともに健康でいる");
  const [guidingStarBack, setGuidingStarBack] = useState("自分の利益と平和が最優先。他人は知らん。");
  const [isEditingStar, setIsEditingStar] = useState(false);
  
  const [randomPhrase, setRandomPhrase] = useState(robotPhrases[0]);
  const [dailyQuestion, setDailyQuestion] = useState("");

  // ★ ダークモード・ライトモードの確実な切り替え
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 初期読み込み
  useEffect(() => {
    const savedEntries = localStorage.getItem('kokoro_entries_v4');
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    
    const savedWorkIdeas = localStorage.getItem('work_ideas');
    if (savedWorkIdeas) setWorkIdeas(savedWorkIdeas);
    const savedWorkDis = localStorage.getItem('work_dissatisfaction');
    if (savedWorkDis) setWorkDissatisfaction(savedWorkDis);
    const savedWorkHope = localStorage.getItem('work_hope');
    if (savedWorkHope) setWorkHope(savedWorkHope);
    const savedWorkTasks = localStorage.getItem('work_tasks');
    if (savedWorkTasks) setWorkTasks(JSON.parse(savedWorkTasks));

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

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSecretTap = () => {
    setTapCount(prev => prev + 1);
    if (tapCount + 1 >= 3) {
      setIsSecretMode(!isSecretMode);
      setTapCount(0);
      if(activeTab === 'work') setActiveTab('input');
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

  const saveWorkData = () => {
    localStorage.setItem('work_ideas', workIdeas);
    localStorage.setItem('work_dissatisfaction', workDissatisfaction);
    localStorage.setItem('work_hope', workHope);
    localStorage.setItem('work_tasks', JSON.stringify(workTasks));
    triggerToast("仕事の計画を保存しました！");
  };

  const addWorkTask = () => setWorkTasks([...workTasks, { id: Date.now().toString(), text: '', done: false }]);
  const updateWorkTask = (id, field, value) => setWorkTasks(workTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  const deleteWorkTask = (id) => setWorkTasks(workTasks.filter(t => t.id !== id));

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

    triggerToast(isSecretMode ? '本音を封印しました！' : '状態を記録しました！');
    if (isSecretMode) {
      setNote('');
    } else {
      setReflection('');
    }
  };

  // ★ バックアップ：人間が読んで分かる形（インデント付き）でJSONを出力
  const exportData = () => {
    const backupData = {
      entries,
      workData: { workIdeas, workDissatisfaction, workHope, workTasks },
      settings: { guidingStarFront, guidingStarBack, isRolandMode }
    };
    // JSON.stringifyの引数に null, 2 を渡して、綺麗に改行させる
    const jsonString = JSON.stringify(backupData, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `self_management_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.entries) {
          setEntries(importedData.entries);
          localStorage.setItem('kokoro_entries_v4', JSON.stringify(importedData.entries));
        }
        if (importedData.workData) {
          setWorkIdeas(importedData.workData.workIdeas || "");
          setWorkDissatisfaction(importedData.workData.workDissatisfaction || "");
          setWorkHope(importedData.workData.workHope || "");
          setWorkTasks(importedData.workData.workTasks || []);
        }
        if (importedData.settings) {
          if(importedData.settings.guidingStarFront) setGuidingStarFront(importedData.settings.guidingStarFront);
          if(importedData.settings.guidingStarBack) setGuidingStarBack(importedData.settings.guidingStarBack);
        }
        triggerToast("データを復元しました！");
      } catch (error) {
        alert("ファイルの読み込みに失敗しました。正しいJSONファイルか確認してください。");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDeleteAllData = () => {
    if (window.confirm("【警告】すべてのデータを消去しますか？\n※「OK」を押すと、まず自動でバックアップがダウンロードされ、その後データが消去されます。")) {
      exportData();
      
      setTimeout(() => {
        localStorage.removeItem('kokoro_entries_v4');
        localStorage.removeItem('work_ideas');
        localStorage.removeItem('work_dissatisfaction');
        localStorage.removeItem('work_hope');
        localStorage.removeItem('work_tasks');
        
        setEntries([]);
        setWorkIdeas("");
        setWorkTasks([]);
        triggerToast("データを全消去しました。");
      }, 1000);
    }
  };


  const generateRobotPhrase = () => setRandomPhrase(robotPhrases[Math.floor(Math.random() * robotPhrases.length)]);

  const getMoodIcon = (level, size = 24) => {
    if (level >= 5) return <Smile size={size} className={isRolandMode ? "text-yellow-500" : "text-orange-500"} />;
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

  const renderWorkTab = () => (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-28">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Briefcase className="text-emerald-500" /> 仕事・転職ベース
        </h2>
        <button onClick={saveWorkData} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-1.5 px-4 rounded-xl transition-colors">
          保存
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">現状を変えるためのアイデアやタスクをここに集約しよう。</p>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-emerald-50 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold mb-3">
          <MessageSquarePlus size={20} className="text-emerald-400" /> アイデア・ブレスト置き場
        </label>
        <textarea 
          value={workIdeas} onChange={(e) => setWorkIdeas(e.target.value)} 
          placeholder="・AIにブログ記事を書かせてみる&#10;・クラウドワークスでデータ入力の案件を探す..." 
          className="w-full bg-emerald-50/50 dark:bg-gray-900/50 dark:text-gray-100 border-none rounded-xl p-4 text-sm outline-none resize-none h-40 transition-colors" 
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-3xl border border-red-100 dark:border-red-900/30">
          <label className="text-sm font-bold text-red-600 dark:text-red-400 mb-2 block">今の仕事の不満 (反骨心の源)</label>
          <textarea value={workDissatisfaction} onChange={(e) => setWorkDissatisfaction(e.target.value)} className="w-full bg-transparent border-none text-sm outline-none resize-none h-20 text-gray-700 dark:text-gray-300" placeholder="何が一番うざい？" />
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <label className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 block">次の仕事の絶対条件 (北極星)</label>
          <textarea value={workHope} onChange={(e) => setWorkHope(e.target.value)} className="w-full bg-transparent border-none text-sm outline-none resize-none h-20 text-gray-700 dark:text-gray-300" placeholder="これだけは譲れない条件は？" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between mb-4">
          <span>具体的なタスク / 案件リスト</span>
          <button onClick={addWorkTask} className="text-emerald-500 flex items-center gap-1 text-sm bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg"><Plus size={16}/> 追加</button>
        </label>
        <div className="space-y-3">
          {workTasks.map(task => (
            <div key={task.id} className="flex items-center gap-3">
              <input type="checkbox" checked={task.done} onChange={(e) => updateWorkTask(task.id, 'done', e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
              <input type="text" value={task.text} onChange={(e) => updateWorkTask(task.id, 'text', e.target.value)} className={`flex-1 bg-transparent border-b border-gray-100 dark:border-gray-700 text-sm outline-none py-1 ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`} placeholder="クラウドワークスの案件名などを入力" />
              <button onClick={() => deleteWorkTask(task.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
          {workTasks.length === 0 && <p className="text-xs text-gray-400">タスクがありません。</p>}
        </div>
      </div>
    </div>
  );

  const renderFrontInput = () => (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 pb-28">
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
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-4"><Heart size={20} className={isRolandMode ? "text-yellow-500" : "text-orange-400"} /> {isRolandMode ? "今の俺のオーラ" : "今の気分"}</label>
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button key={level} onClick={() => setMood(level)} className={`p-3 rounded-full transition-all ${mood === level ? (isRolandMode ? 'bg-yellow-100 dark:bg-yellow-900/50 scale-110' : 'bg-orange-100 dark:bg-gray-700 scale-110') : 'grayscale opacity-50'}`}>{getMoodIcon(level, 32)}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-pink-50 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2">
          <Crown size={20} className="text-pink-400" /> {isRolandMode ? "唯我独尊メーター" : "自己中度合い"} <span className="ml-auto text-sm text-gray-400">{selfishness}%</span>
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

  const renderBackInput = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-28">
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
    const now = new Date();
    const filteredEntries = entries.filter(e => {
      const isCorrectMode = isSecretMode ? e.isSecret : !e.isSecret;
      if (!isCorrectMode) return false;
      
      const entryDate = new Date(e.date);
      if (chartSpan === 'today') {
        return entryDate.toDateString() === now.toDateString();
      } else if (chartSpan === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= oneWeekAgo;
      }
      return true;
    });

    const renderSpanButtons = () => (
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setChartSpan('today')} className={`px-4 py-1 text-xs font-bold rounded-full border transition-colors ${chartSpan === 'today' ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900' : 'bg-transparent text-gray-500 border-gray-300 dark:border-gray-700'}`}>今日</button>
        <button onClick={() => setChartSpan('week')} className={`px-4 py-1 text-xs font-bold rounded-full border transition-colors ${chartSpan === 'week' ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900' : 'bg-transparent text-gray-500 border-gray-300 dark:border-gray-700'}`}>1週間</button>
        <button onClick={() => setChartSpan('all')} className={`px-4 py-1 text-xs font-bold rounded-full border transition-colors ${chartSpan === 'all' ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-900' : 'bg-transparent text-gray-500 border-gray-300 dark:border-gray-700'}`}>すべて</button>
      </div>
    );

    if (filteredEntries.length === 0) return <div className="p-8 flex flex-col items-center justify-center h-full"><p className="text-gray-500 mb-4">この期間のデータがありません</p>{renderSpanButtons()}</div>;
    
    const graphData = [...filteredEntries].reverse().map(d => ({
      ...d,
      chartLabel: chartSpan === 'today' ? d.displayTime : `${d.displayDate} ${d.displayTime}`
    }));

    return (
      <div className="p-4 space-y-6 animate-in fade-in pb-28">
        {renderSpanButtons()}
        {isSecretMode ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2"><ShieldAlert size={16} className="text-red-400" />人間うざい度 と 気分</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="chartLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTextColor }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[1, 5]} hide />
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
                    <XAxis dataKey="chartLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTextColor }} dy={10} />
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
                    <XAxis dataKey="chartLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTextColor }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[1, 5]} hide />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                    <Line yAxisId="right" type="monotone" dataKey="mood" name="気分(1-5)" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="selfishness" name="自己中度合い" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2"><Wind size={16} className="text-cyan-400" />脳のクリアさ vs 運動不足</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="chartLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: chartTextColor }} dy={10} />
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
    
    return (
      <div className="p-4 space-y-4 animate-in fade-in pb-28">
        {filteredEntries.length === 0 ? (
          <div className="p-8 flex items-center justify-center"><p className="text-gray-500">まだ記録がありません</p></div>
        ) : (
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
                          {entry.selfishness !== undefined && <span className="text-xs font-medium bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-1 rounded-md">自己中度 {entry.selfishness}%</span>}
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
        )}

        {/* データバックアップ・復元エリア */}
        <div className="mt-8 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Activity size={16} className="text-gray-500" /> データ管理
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">機種変更やアップデートに備えてバックアップ！</p>
          
          <div className="flex gap-2">
            <button onClick={exportData} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-bold py-2 rounded-xl text-gray-700 dark:text-gray-200 transition-colors">
              <Download size={16} /> 書き出し
            </button>
            <button onClick={() => fileInputRef.current.click()} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-bold py-2 rounded-xl text-gray-700 dark:text-gray-200 transition-colors">
              <Upload size={16} /> 復元する
            </button>
            <input type="file" accept=".json" ref={fileInputRef} onChange={importData} className="hidden" />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button onClick={handleDeleteAllData} className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-bold py-2 rounded-xl transition-colors">
              <AlertOctagon size={16} /> 全データを消去してリセット
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    // ★ はみ出し防止（overflow-x-hidden）を一番外側のコンテナに追加
    <div className="min-h-screen bg-stone-50 dark:bg-gray-950 font-sans flex justify-center text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">
      <div className="w-full max-w-md bg-stone-50 dark:bg-gray-900 min-h-screen flex flex-col relative shadow-2xl overflow-x-hidden">
        
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md pt-6 pb-4 px-4 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
          <h1 
            onClick={handleSecretTap}
            className={`text-xl font-extrabold bg-gradient-to-r ${isSecretMode ? 'from-red-500 to-orange-500' : (isRolandMode ? 'from-yellow-400 to-amber-600' : 'from-orange-500 to-pink-500')} bg-clip-text text-transparent flex items-center gap-2 cursor-pointer select-none`}
          >
            {isSecretMode ? <ShieldAlert size={24} className="text-red-500" /> : (isRolandMode ? <Crown size={24} className="text-yellow-500" /> : <Activity size={24} className="text-orange-500" />)}
            {isSecretMode ? '自己管理アプリ (裏)' : (isRolandMode ? '帝王のキロク' : '自己管理アプリ')}
          </h1>
          
          <div className="flex items-center gap-2">
            {!isSecretMode && (
              <button onClick={toggleRolandMode} className={`p-2 rounded-full transition-colors ${isRolandMode ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'}`}>
                <Crown size={20} />
              </button>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'input' && (
            <>
              {isSecretMode ? renderBackInput() : renderFrontInput()}
              <div className="px-4 pb-28 pt-2">
                <button 
                  onClick={handleSave} 
                  className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 
                    ${isSecretMode ? 'bg-red-500 hover:bg-red-600' : (isRolandMode ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700' : 'bg-orange-500 hover:bg-orange-600')}`}
                >
                  {isSecretMode ? <ShieldAlert size={20} /> : (isRolandMode ? <Crown size={20} /> : <Activity size={20} />)}
                  {isSecretMode ? '本音を封印する' : (isRolandMode ? '歴史を刻む' : '状態を記録する')}
                </button>
              </div>
            </>
          )}
          {activeTab === 'work' && renderWorkTab()}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'history' && renderHistory()}
        </main>

        {showToast && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in z-50 whitespace-nowrap">
            <CheckCircle2 size={18} className={isSecretMode ? "text-red-400" : (isRolandMode ? "text-yellow-400" : "text-green-400")} />
            {toastMessage}
          </div>
        )}

        <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 transition-colors">
          <div className="flex justify-around items-center h-16 px-1">
            <button onClick={() => setActiveTab('input')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'input' ? (isSecretMode ? 'text-red-500' : (isRolandMode ? 'text-yellow-600' : 'text-orange-500')) : 'text-gray-400'}`}>
              <PenTool size={20} className={activeTab === 'input' ? (isSecretMode ? 'fill-red-900/50' : (isRolandMode ? 'fill-yellow-900/50' : 'fill-orange-100 dark:fill-orange-900/50')) : ''} />
              <span className="text-[10px] font-bold">記録</span>
            </button>
            
            {!isSecretMode && (
              <button onClick={() => setActiveTab('work')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'work' ? 'text-emerald-500' : 'text-gray-400'}`}>
                <Briefcase size={20} className={activeTab === 'work' ? 'fill-emerald-100 dark:fill-emerald-900/50' : ''} />
                <span className="text-[10px] font-bold">仕事/転職</span>
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


