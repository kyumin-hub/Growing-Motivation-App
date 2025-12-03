import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, MessageCircleHeart, BookOpen, Sun, Heart, Plus, Trash2, Home, List, FileText } from 'lucide-react';
import { Mission, PlantStage, CheeringMessage, Tab, Subject } from './types';
import { Plant } from './components/Plant';
import { ProjectPlan } from './components/ProjectPlan';
import { getWarmMessage, getSuggestedMissions } from './services/geminiService';

const DEFAULT_MISSIONS: Mission[] = [
  { id: '1', text: '이불 정리하기', xp: 10, completed: false },
  { id: '2', text: '창문 열어 환기하기', xp: 15, completed: false },
  { id: '3', text: '물 한 잔 천천히 마시기', xp: 10, completed: false },
  { id: '4', text: '좋아하는 노래 1곡 듣기', xp: 20, completed: false },
  { id: '5', text: '거울 보고 웃어보기', xp: 15, completed: false },
];

const DEFAULT_SUBJECTS: Subject[] = [
  { 
    id: 's1', 
    name: '영어 단어', 
    color: 'bg-orange-50', 
    tasks: [
      { id: 't1', text: 'Day 1 단어 10개 외우기', xp: 20, completed: false },
      { id: 't2', text: '영어 지문 1개 읽기', xp: 30, completed: false }
    ] 
  },
  { 
    id: 's2', 
    name: '수학', 
    color: 'bg-blue-50', 
    tasks: [
      { id: 't3', text: '기본 문제 5개 풀기', xp: 25, completed: false }
    ] 
  }
];

const DEFAULT_MESSAGES: CheeringMessage[] = [
  { id: '1', text: '오늘 하루도 버텨줘서 고마워요.', author: '익명의 친구', likes: 12 },
  { id: '2', text: '천천히 가도 괜찮아요. 멈추지 않는 게 중요하니까요.', author: '나무늘보', likes: 8 },
  { id: '3', text: '당신은 충분히 사랑받을 자격이 있어요.', author: '햇살', likes: 24 },
];

const SUBJECT_COLORS = ['bg-orange-50', 'bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-pink-50', 'bg-yellow-50'];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [missions, setMissions] = useState<Mission[]>(DEFAULT_MISSIONS);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [xp, setXp] = useState(0);
  const [plantStage, setPlantStage] = useState<PlantStage>(PlantStage.SEED);
  const [messages, setMessages] = useState<CheeringMessage[]>(DEFAULT_MESSAGES);
  const [aiMessage, setAiMessage] = useState<string>("당신의 오늘을 응원해요.");
  const [newTaskInputs, setNewTaskInputs] = useState<{[key: string]: string}>({});
  const [newSubjectName, setNewSubjectName] = useState("");

  // Initialize and load AI suggestions
  useEffect(() => {
    const fetchAiData = async () => {
      // Fetch gentle greeting
      const msg = await getWarmMessage("User just opened the app.");
      setAiMessage(msg);
      
      // Fetch extra missions
      const newMissions = await getSuggestedMissions();
      const formatMissions: Mission[] = newMissions.map((text, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        text,
        xp: 15,
        completed: false,
        isAiGenerated: true
      }));
      
      setMissions(prev => {
        // Avoid duplicates if strictly needed, but simple append is okay for prototype
        const existingTexts = new Set(prev.map(m => m.text));
        const filteredNew = formatMissions.filter(m => !existingTexts.has(m.text));
        return [...prev, ...filteredNew];
      });
    };

    fetchAiData();
  }, []);

  // Handle XP and Growth
  useEffect(() => {
    let newStage = PlantStage.SEED;
    if (xp >= 100) newStage = PlantStage.TREE;
    else if (xp >= 75) newStage = PlantStage.FLOWER;
    else if (xp >= 50) newStage = PlantStage.SAPLING;
    else if (xp >= 20) newStage = PlantStage.SPROUT;
    
    setPlantStage(newStage);
  }, [xp]);

  const toggleMission = (id: string) => {
    setMissions(missions.map(m => {
      if (m.id === id) {
        if (!m.completed) {
          setXp(prev => prev + m.xp);
        } else {
          setXp(prev => Math.max(0, prev - m.xp));
        }
        return { ...m, completed: !m.completed };
      }
      return m;
    }));
  };

  const toggleStudyTask = (subjectId: string, taskId: string) => {
    setSubjects(subjects.map(subj => {
      if (subj.id === subjectId) {
        const updatedTasks = subj.tasks.map(task => {
          if (task.id === taskId) {
            if (!task.completed) {
              setXp(prev => prev + task.xp);
            } else {
              setXp(prev => Math.max(0, prev - task.xp));
            }
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        return { ...subj, tasks: updatedTasks };
      }
      return subj;
    }));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const color = SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length];
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      color,
      tasks: []
    };
    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
  };

  const deleteSubject = (id: string) => {
    if (window.confirm("정말 이 과목을 삭제할까요?")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const addStudyTask = (subjectId: string) => {
    const text = newTaskInputs[subjectId];
    if (!text || !text.trim()) return;

    const newTask: Mission = {
      id: Date.now().toString(),
      text: text,
      xp: 20,
      completed: false
    };

    setSubjects(subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, tasks: [...s.tasks, newTask] };
      }
      return s;
    }));

    setNewTaskInputs({ ...newTaskInputs, [subjectId]: "" });
  };

  const handleSendWarmth = async () => {
     const newMsg = await getWarmMessage("User wants to hear something supportive.");
     const newMessage: CheeringMessage = {
       id: Date.now().toString(),
       text: newMsg,
       author: 'AI 마음지킴이',
       likes: 0
     };
     setMessages([newMessage, ...messages]);
  };

  const renderHome = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      <header className="px-6 py-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            작은 새싹 <Sprout className="text-green-500" />
          </h1>
          <p className="text-sm text-stone-500">나만의 작은 정원</p>
        </div>
        <div className="bg-amber-100 px-3 py-1 rounded-full text-amber-800 text-sm font-medium flex items-center gap-1">
          <Sun className="w-4 h-4" /> LV. {Math.floor(xp / 20) + 1}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4">
        {/* AI Greeting Bubble */}
        <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border border-stone-100 mb-6 mt-4 relative animate-fade-in">
          <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-t border-l border-stone-100 transform rotate-45"></div>
          <p className="text-stone-700 text-center hand-font text-xl leading-relaxed">
            "{aiMessage}"
          </p>
        </div>

        {/* Plant View */}
        <div className="w-full max-w-md bg-gradient-to-b from-blue-50/50 to-green-50/50 rounded-3xl p-8 shadow-inner border border-white mb-6">
          <Plant stage={plantStage} xp={xp} />
        </div>

        {/* Quick Actions */}
        <div className="w-full max-w-md">
          <h3 className="text-stone-600 font-bold mb-3 px-2">오늘의 작은 걸음</h3>
          <div className="space-y-3">
            {missions.filter(m => !m.completed).slice(0, 3).map(mission => (
              <button
                key={mission.id}
                onClick={() => toggleMission(mission.id)}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between hover:bg-green-50 transition-colors group"
              >
                <span className="text-stone-700">{mission.text}</span>
                <div className="w-6 h-6 rounded-full border-2 border-stone-300 group-hover:border-green-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              </button>
            ))}
            {missions.filter(m => !m.completed).length === 0 && (
               <div className="p-4 text-center text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                 모든 미션을 완료했어요! 정말 멋져요. 🌿
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  const renderMissions = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-6 pt-6">
       <h2 className="text-2xl font-bold text-stone-800 mb-2">오늘의 미션</h2>
       <p className="text-stone-500 mb-6">작은 성공들이 모여 숲을 이룰 거예요.</p>
       <div className="space-y-3">
         {missions.map(mission => (
           <button
             key={mission.id}
             onClick={() => toggleMission(mission.id)}
             className={`w-full p-4 rounded-xl shadow-sm border flex items-center justify-between transition-all ${
               mission.completed ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-100'
             }`}
           >
             <span className={`text-stone-700 ${mission.completed ? 'line-through text-stone-400' : ''}`}>
               {mission.text}
             </span>
             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
               mission.completed ? 'bg-green-500 border-green-500' : 'border-stone-300'
             }`}>
               {mission.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
             </div>
           </button>
         ))}
       </div>
    </div>
  );

  const renderStudy = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-6 pt-6">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
          <BookOpen className="text-blue-500" /> 공부 기록
        </h2>
        <p className="text-stone-500">무리하지 말고, 할 수 있는 만큼만.</p>
      </header>

      {/* Add Subject Input */}
      <div className="flex gap-2 mb-8">
        <input 
           value={newSubjectName} 
           onChange={(e) => setNewSubjectName(e.target.value)}
           placeholder="새로운 과목 추가 (예: 코딩, 독서)"
           className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <button onClick={addSubject} className="bg-stone-800 text-white px-4 rounded-xl hover:bg-stone-700 transition-colors">
          <Plus />
        </button>
      </div>

      <div className="space-y-6">
        {subjects.map(subject => (
           <div key={subject.id} className={`rounded-2xl p-5 ${subject.color} border border-stone-100/50`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-stone-800 text-lg">{subject.name}</h3>
               <button onClick={() => deleteSubject(subject.id)} className="text-stone-400 hover:text-red-400">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
             
             <div className="space-y-2 mb-4">
               {subject.tasks.map(task => (
                 <button 
                   key={task.id}
                   onClick={() => toggleStudyTask(subject.id, task.id)}
                   className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors text-left"
                 >
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-stone-300'}`}>
                     {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <span className={`text-stone-700 ${task.completed ? 'line-through opacity-50' : ''}`}>
                     {task.text}
                   </span>
                 </button>
               ))}
               {subject.tasks.length === 0 && <p className="text-xs text-stone-400 pl-2">아직 할 일이 없어요.</p>}
             </div>

             <div className="flex gap-2">
               <input 
                 value={newTaskInputs[subject.id] || ''}
                 onChange={(e) => setNewTaskInputs({...newTaskInputs, [subject.id]: e.target.value})}
                 placeholder="할 일 추가..."
                 className="flex-1 px-3 py-2 text-sm bg-white/60 rounded-lg border-none focus:ring-1 focus:ring-stone-300"
                 onKeyDown={(e) => e.key === 'Enter' && addStudyTask(subject.id)}
               />
               <button onClick={() => addStudyTask(subject.id)} className="p-2 bg-white/60 rounded-lg text-stone-600 hover:bg-white">
                 <Plus className="w-4 h-4" />
               </button>
             </div>
           </div>
        ))}
        {subjects.length === 0 && (
          <div className="text-center py-10 text-stone-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>공부하고 싶은 과목을 추가해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-6 pt-6">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">서로의 온기</h2>
      <p className="text-stone-500 mb-6">따뜻한 말 한마디가 큰 힘이 됩니다.</p>
      
      <div className="bg-green-50 p-4 rounded-xl mb-6 flex items-start gap-3">
        <MessageCircleHeart className="w-6 h-6 text-green-600 shrink-0" />
        <div>
          <p className="text-green-900 font-medium text-sm">익명 응원하기</p>
          <p className="text-green-800 text-xs mt-1">오늘 힘든 친구를 위해 버튼을 눌러주세요.</p>
          <button 
            onClick={handleSendWarmth}
            className="mt-2 bg-white text-green-700 text-xs px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
          >
            응원 보내기
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
            <p className="text-stone-700 text-sm mb-3 leading-relaxed">"{msg.text}"</p>
            <div className="flex justify-between items-center text-xs text-stone-400">
              <span>By. {msg.author}</span>
              <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                <Heart className="w-3 h-3" /> {msg.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
     <div className="bg-[#fcfdf9] h-screen w-full max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
       <div className="flex-1 overflow-hidden relative">
         {activeTab === 'HOME' && renderHome()}
         {activeTab === 'MISSIONS' && renderMissions()}
         {activeTab === 'STUDY' && renderStudy()}
         {activeTab === 'COMMUNITY' && renderCommunity()}
         {activeTab === 'PLANNING' && <ProjectPlan />}
       </div>

       {/* Tab Bar */}
       <nav className="bg-white border-t border-stone-100 px-2 py-2 flex justify-around items-center absolute bottom-0 w-full z-20 pb-safe">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'HOME' ? 'text-green-600' : 'text-stone-400'}`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px]">홈</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('MISSIONS')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'MISSIONS' ? 'text-green-600' : 'text-stone-400'}`}
          >
            <List className="w-6 h-6 mb-1" />
            <span className="text-[10px]">미션</span>
          </button>

          <button 
            onClick={() => setActiveTab('STUDY')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'STUDY' ? 'text-green-600' : 'text-stone-400'}`}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-[10px]">공부</span>
          </button>

          <button 
            onClick={() => setActiveTab('COMMUNITY')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'COMMUNITY' ? 'text-green-600' : 'text-stone-400'}`}
          >
            <MessageCircleHeart className="w-6 h-6 mb-1" />
            <span className="text-[10px]">소통</span>
          </button>

          <button 
            onClick={() => setActiveTab('PLANNING')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'PLANNING' ? 'text-green-600' : 'text-stone-400'}`}
          >
            <FileText className="w-6 h-6 mb-1" />
            <span className="text-[10px]">기획안</span>
          </button>
       </nav>
     </div>
  );
}