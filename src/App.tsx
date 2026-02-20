import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { 
  PenTool, BarChart3, List as ListIcon, ShieldAlert,
  Smile, Frown, Meh, Heart, Zap, Clock, CheckCircle2, Activity,
  Moon, Sun, Loader2, BrainCircuit, Compass, Bot
} from 'lucide-react';

const robotPhrases = [
  "「あ、はい、分かりました（スッ…）」",
  "「確認して、後ほど対応します（無表情）」",
  "「貴重なご意見ありがとうございます（心はシャットダウン）」",
  "「規定により、そのような対応となります（ロボットボイス）」",
  "「承知いたしました（帰って何しようかな）」"
];

export default function App() {
  const [activeTab, setActiveTab] = useState('input');
  const [entries, setEntries] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // --- 入力フォーム用 ---
  const [mood, setMood] = useState(3);
  const [condition, setCondition] = useState(50);
  const [humanAnnoyance, setHumanAnnoyance] = useState(50);
  const [blameScale, setBlameScale] = useState(50);
  const [note, setNote] = useState('');
  
  const [guidingStar, setGuidingStar] = useState("自分の利益と平和が最優先。他人は知らん。");
  const [isEditingStar, setIsEditingStar] = useState(false);
  
  const [randomPhrase, setRandomPhrase] = useState(robotPhrases[0]);

  // ★ スマホ（ブラウザ）の本体にデータを保存・読み込みする魔法
  useEffect(() => {
    // 保存された記録を読み込む
    const savedEntries = localStorage.getItem('kokoro_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    // 北極星を読み込む
    const savedStar = localStorage.getItem('kokoro_star');
    if (savedStar) {
      setGuidingStar(savedStar);
    }
    setIsLoading(false);
  }, []);

  // Tailwind CSS を読み込むための特殊な記述（Vercelですぐ動くように）
  // ※エラー修正: Reactのルールに従い、return（isLoading時の早期リターン）よりも前にHookを配置しました。
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);
  }, []);

  const handleSaveGuidingStar = () => {
    localStorage.setItem('kokoro_star', guidingStar);
    setIsEditingStar(false);
  };

  const handleSave = () => {
    const now = new Date();
    const newEntry = {
      id: now.getTime().toString(),
      date: now.toISOString(),
      displayDate: `${now.getMonth() + 1}/${now.getDate()}`,
      displayTime: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      mood, condition, humanAnnoyance, blameScale, note,
    };

    // 新しい記録を追加して、スマホ本体に保存！
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('kokoro_entries', JSON.stringify(updatedEntries));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setNote(''); 
  };

  const generateRobotPhrase = () => {
    const randomIndex = Math.floor(Math.random() * robotPhrases.length);
    setRandomPhrase(robotPhrases[randomIndex]);
  };

  const getMoodIcon = (level, size = 24) => {
    if (level >= 5) return <Smile size={size} className="text-orange-500" />;
    if (level === 4) return <Smile size={size} className="text-yellow-500" />;
    if (level === 3) return <Meh size={size} className="text-green-500" />;
    if (level === 2) return <Frown size={size} className="text-blue-500" />;
    return <Frown size={size} className="text-indigo-500" />;
  };

  const chartTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const chartGridColor = isDarkMode ? '#374151' : '#f3f4f6';
  const tooltipBgColor = isDarkMode ? '#1f2937' : '#ffffff';
  const tooltipTextColor = isDarkMode ? '#f3f4f6' : '#111827';

  // --- ローディング画面（すべてのHookのあとに配置） ---
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950' : 'bg-stone-50'}`}>
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  }

  const renderInput = () => (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* 自分の利益最優先コンパス */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-4 rounded-2xl shadow-sm border border-teal-100 dark:border-teal-800/50">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold mb-2">
          <Compass size={18} />
          <span>俺の絶対的ルール（北極星）</span>
        </div>
        {isEditingStar ? (
          <div className="flex gap-2">
            <input 
              value={guidingStar}
              onChange={(e) => setGuidingStar(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 rounded-lg border border-teal-200 dark:border-teal-700 outline-none"
            />
            <button onClick={handleSaveGuidingStar} className="bg-teal-500 text-white px-3 py-1 text-sm rounded-lg font-bold">完了</button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingStar(true)}
            className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors font-medium"
          >
            「{guidingStar}」 <span className="text-xs text-gray-400 ml-1">(変更)</span>
          </div>
        )}
      </div>

      {/* 気分 */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-orange-50 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-4">
          <Heart size={20} className="text-orange-400" /> 今の「気分」
        </label>
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button key={level} onClick={() => setMood(level)}
              className={`p-3 rounded-full transition-all ${mood === level ? 'bg-orange-100 dark:bg-gray-700 scale-110 shadow-inner' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}>
              {getMoodIcon(level, 32)}
            </button>
          ))}
        </div>
      </div>

      {/* 防衛＆客観視メーター */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-red-50 dark:border-red-900/30 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2">
            <ShieldAlert size={20} className="text-red-400" /> 人間うざい度（ヘイト値）
            <span className="ml-auto font-bold text-red-500 dark:text-red-400">{humanAnnoyance}%</span>
          </label>
          <input type="range" min="0" max="100" value={humanAnnoyance} onChange={(e) => setHumanAnnoyance(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-red-500 mt-2" />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
            <span>平和</span>
            <span>全員消えろ</span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-2">
            <BrainCircuit size={20} className="text-purple-400" /> 感情のバランス
          </label>
          <input type="range" min="0" max="100" value={blameScale} onChange={(e) => setBlameScale(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-purple-500 mt-2" />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
            <span className={blameScale < 30 ? "text-blue-500" : ""}>自己嫌悪</span>
            <span className={blameScale >= 30 && blameScale <= 70 ? "text-green-500" : ""}>状況のせい</span>
            <span className={blameScale > 70 ? "text-red-500" : ""}>あいつがうざい</span>
          </div>
        </div>
      </div>

      {/* ロボットモード定型文 */}
      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-800">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium mb-3">
          <Bot size={20} className="text-gray-500" /> 仕事用ロボット防衛モード
        </label>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl text-sm text-gray-700 dark:text-gray-300 mb-3 border border-gray-100 dark:border-gray-700 text-center font-mono">
          {randomPhrase}
        </div>
        <button onClick={generateRobotPhrase} className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-xl text-sm font-bold transition-colors">
          別の定型文を装填する
        </button>
      </div>

      {/* 吐き出し用ジャーナル */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium mb-3">
          <PenTool size={20} className="text-teal-500" />
          ドロドロ本音ダンプ（完全非公開）
        </label>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="あいつマジでうざい。早く家で仕事したい..."
          className="w-full bg-gray-50 dark:bg-gray-900/50 dark:text-gray-100 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50 outline-none resize-none h-32 transition-colors placeholder:text-gray-400"
        />
      </div>

      <button onClick={handleSave} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 flex justify-center items-center gap-2">
        <ShieldAlert size={20} />
        本音と状態を保存（封印）する
      </button>
    </div>
  );

  const renderDashboard = () => {
    if (entries.length === 0) return <div className="p-8 flex items-center justify-center h-full"><p className="text-gray-500">まだデータがありません</p></div>;
    const graphData = [...entries].reverse();

    return (
      <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">自分の波（とヘイト）を知る</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-400" />人間うざい度 と 気分
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
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
          <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            <BrainCircuit size={16} className="text-purple-400" />自己嫌悪 vs 他責の波
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderRadius: '12px', border: 'none' }} labelStyle={{ fontWeight: 'bold', color: tooltipTextColor }} itemStyle={{ color: tooltipTextColor }} />
                <ReferenceLine y={50} stroke={chartGridColor} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="blameScale" name="他責寄り(上) / 自責寄り(下)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (entries.length === 0) return <div className="p-8 flex items-center justify-center h-full"><p className="text-gray-500">まだ記録がありません</p></div>;

    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">封印した本音履歴</h2>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex gap-4 items-start">
                <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-full flex-shrink-0">
                  {getMoodIcon(entry.mood, 28)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Clock size={14} className="text-orange-400"/>
                      {entry.displayDate} {entry.displayTime || ''}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    <span className="text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">人間うざい度 {entry.humanAnnoyance}%</span>
                    <span className="text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-md">
                      {entry.blameScale < 40 ? '自己嫌悪モード' : entry.blameScale > 60 ? '他人がうざいモード' : '客観視モード'}
                    </span>
                  </div>
                </div>
              </div>

              {entry.note && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex gap-2 items-start text-sm text-gray-600 dark:text-gray-300">
                    <PenTool size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="whitespace-pre-wrap leading-relaxed">{entry.note}</p>
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
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-2">
            <ShieldAlert size={24} className="text-orange-500" />
            ココロとキロク (裏)
          </h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'input' && renderInput()}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'history' && renderHistory()}
        </main>

        {showToast && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50 whitespace-nowrap">
            <CheckCircle2 size={18} className="text-green-400 dark:text-green-600" />
            本音を封印しました！
          </div>
        )}

        <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 transition-colors">
          <div className="flex justify-around items-center h-16 px-2">
            <button onClick={() => setActiveTab('input')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'input' ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <PenTool size={22} className={activeTab === 'input' ? 'fill-red-100 dark:fill-red-900/50' : ''} />
              <span className="text-[10px] font-bold">ダンプ</span>
            </button>
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'dashboard' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <BarChart3 size={22} className={activeTab === 'dashboard' ? 'fill-blue-100 dark:fill-blue-900/50' : ''} />
              <span className="text-[10px] font-bold">データ</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'history' ? 'text-purple-500 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <ListIcon size={22} className={activeTab === 'history' ? 'fill-purple-100 dark:fill-purple-900/50' : ''} />
              <span className="text-[10px] font-bold">履歴</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}