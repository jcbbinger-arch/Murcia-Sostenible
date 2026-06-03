import React, { useState } from 'react';
import { resizeImage } from '../lib/imageResizer';
import { ZONES } from '../constants';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { TeamMember } from '../types';
import { CheckCircle, FileText, UserPlus, Trash, Printer, Eye, EyeOff, Upload, Image as ImageIcon, Users, Lock, Unlock, ChevronDown, ChevronUp, Lightbulb, Info } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

const TeamMemberInput: React.FC<{ member: TeamMember, updateTeamMembers: (members: TeamMember[]) => void, allTeam: TeamMember[] }> = ({ member, updateTeamMembers, allTeam }) => {
    const [name, setName] = useState(member.name);
    const [isFocused, setIsFocused] = useState(false);
    const { profile } = useAuth();

    React.useEffect(() => {
        if (!isFocused) {
            setName(member.name);
        }
    }, [member.name, isFocused]);

    const handleSave = () => {
        if (name !== member.name) {
            const updated = allTeam.map(m => m.id === member.id ? { ...m, name: name } : m);
            updateTeamMembers(updated);
        }
    };

    return (
        <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); handleSave(); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className={`bg-transparent outline-none border-b border-transparent hover:border-gray-300 focus:border-green-500 w-full ${member.isCoordinator ? "font-bold text-green-800" : "text-gray-700"} ${member.id === profile?.uid ? "text-blue-600 font-bold" : ""}`}                
        />
    );
};

export const Task1_TeamZone: React.FC = () => {
  const { 
    state, 
    selectZone, 
    updateTeamName, 
    updateTeamMembers, 
    updateZoneJustification,
    updateSchoolSettings,
    updateImage,
    assignTask,
    toggleTeamLock
  } = useProject();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'instructions' | 'development' | 'distribution' | 'deliverable'>('instructions');
  const [newMemberName, setNewMemberName] = useState('');
  const [schoolName, setSchoolName] = useState(state.schoolName);
  const [academicYear, setAcademicYear] = useState(state.academicYear);
  const [teamName, setTeamName] = useState(state.teamName);
  const [zoneJustification, setZoneJustification] = useState(state.zoneJustification);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [expandedZoneId, setExpandedZoneId] = useState<number | null>(null);
  const [expandedDistTaskId, setExpandedDistTaskId] = useState<number | null>(null);

  // Sync with context changes
  React.useEffect(() => {
    if (focusedField !== 'schoolName') setSchoolName(state.schoolName);
    if (focusedField !== 'academicYear') setAcademicYear(state.academicYear);
    if (focusedField !== 'teamName') setTeamName(state.teamName);
    if (focusedField !== 'zoneJustification') setZoneJustification(state.zoneJustification);
  }, [state.schoolName, state.academicYear, state.teamName, state.zoneJustification, focusedField]);

  const getTaskCount = (memberId: string) => state.task2.tasks.filter(t => t.assignedToId === memberId).length;

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    if (state.team.length >= 5) return;
    if (state.isTeamClosed) {
        alert("El equipo está cerrado y no se pueden añadir más miembros.");
        return;
    }
    
    const newMember: TeamMember = {
        id: generateId(),
        name: newMemberName,
        isCoordinator: state.team.length === 0 // First one is default coordinator
    };
    
    updateTeamMembers([...state.team, newMember]);
    setNewMemberName('');
  };

  const handleRemoveMember = (id: string) => {
    updateTeamMembers(state.team.filter(m => m.id !== id));
  };

  const setCoordinator = (id: string) => {
    const updated = state.team.map(m => ({
        ...m,
        isCoordinator: m.id === id
    }));
    updateTeamMembers(updated);
  };

  const handlePrint = () => window.print();

  const toggleZoneDetails = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExpandedZoneId(expandedZoneId === id ? null : id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'schoolLogo' | 'groupPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, 400, 400);
        updateImage(type, resized);
      } catch (err) {
        console.error("Error resizing image:", err);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center no-print">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 1: Equipo y Zona</h2>
            <p className="text-gray-600 mt-2">Fase 0 - Preparación | Entrega: Semana 1</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Código del Proyecto</p>
                    <p className="text-lg font-mono font-black text-green-600 leading-none mt-1">{state.code}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('instructions')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'instructions' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Instrucciones
                </button>
                <button 
                    onClick={() => setActiveTab('development')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'development' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Desarrollo
                </button>
                <button 
                    onClick={() => setActiveTab('distribution')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'distribution' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Reparto Global
                </button>
                <button 
                    onClick={() => setActiveTab('deliverable')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'deliverable' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Entregable
                </button>
            </div>
        </div>
      </div>

      {/* TAB 1: INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Guía de la Tarea 1</h3>
            
            <div className="prose max-w-none text-gray-700 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900">1. Objetivo</h4>
                    <p>Formar los equipos de trabajo y tomar la primera decisión estratégica: elegir el "terreno de juego" (Zona Gastronómica). Una buena elección, alineada con los intereses del equipo, es el primer paso hacia el éxito.</p>
                </div>

                <h4 className="font-bold text-lg mt-6">2. Instrucciones Paso a Paso</h4>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Paso 1: Formación de Equipos.</strong> Equipos de 3 a 5 miembros. Se recomienda multidisciplinariedad.</li>
                    <li><strong>Paso 2: Nombrar al Equipo.</strong> Elegid un nombre creativo. Decidid quién será el <strong>Coordinador/a</strong> (Arquitecto del Proyecto).</li>
                    <li><strong>Paso 3: Selección de Zona.</strong> Analizad las 10 zonas y elegid una. Varios equipos pueden elegir la misma.</li>
                </ul>

                <h4 className="font-bold text-lg mt-6">3. Entregable</h4>
                <p>El Coordinador debe entregar un documento con:</p>
                <ul className="list-disc pl-5">
                    <li>Nombre del Equipo</li>
                    <li>Componentes (indicando Coordinador)</li>
                    <li>Zona Gastronómica Seleccionada</li>
                    <li>Breve Justificación (2-3 líneas)</li>
                </ul>
            </div>
            
            <button 
                onClick={() => setActiveTab('development')}
                className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
            >
                Comenzar Tarea <FileText size={20} />
            </button>
        </div>
      )}

      {/* TAB: DISTRIBUTION */}
      {activeTab === 'distribution' && (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Users size={24} className="text-purple-600" /> Panel de Reparto Global de Tareas
                </h3>
                
                <p className="text-gray-600 mb-8">
                    Para asegurar el éxito del proyecto, es fundamental que cada miembro sepa de qué parte es responsable. 
                    Asignad las 10 micro-tareas de investigación que se desarrollarán en la siguiente fase.
                </p>
                
                {/* Team Status */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {state.team.map(member => {
                         const count = getTaskCount(member.id);
                         let color = "bg-gray-50 border-gray-200";
                         if (count > 0 && count <= 2) color = "bg-green-50 border-green-200 text-green-800";
                         if (count === 3) color = "bg-yellow-50 border-yellow-200 text-yellow-800";
                         if (count >= 4) color = "bg-red-50 border-red-200 text-red-800";

                         return (
                            <div key={member.id} className={`p-4 rounded-xl border-2 min-w-[150px] text-center ${color}`}>
                                <p className="font-bold">{member.name}</p>
                                <p className="text-sm mt-1">{count} tareas asignadas</p>
                            </div>
                         )
                    })}
                </div>

                 {/* Assignment List */}
                 <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                         <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] font-black tracking-widest border-b border-gray-200">
                             <tr>
                                 <th className="p-4 w-12">#</th>
                                 <th className="p-4">Micro-Tarea de Investigación</th>
                                 <th className="p-4">Responsable</th>
                                 <th className="p-4 w-12 text-center">Info</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {state.task2.tasks.map(task => {
                                 const isExpanded = expandedDistTaskId === task.id;
                                 return (
                                     <React.Fragment key={task.id}>
                                         <tr 
                                             className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                                             onClick={() => setExpandedDistTaskId(isExpanded ? null : task.id)}
                                         >
                                             <td className="p-4 text-xs font-bold text-slate-400">{task.id}</td>
                                             <td className="p-4">
                                                 <div className="font-bold text-gray-900 group flex items-center gap-2">
                                                     {task.title}
                                                     <div className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-normal transition-opacity">Ver detalles</div>
                                                 </div>
                                                 <div className="text-xs text-gray-500 mt-0.5">{task.description}</div>
                                             </td>
                                             <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                 <select 
                                                     className={`border border-gray-300 p-2.5 rounded-lg w-full max-w-[250px] bg-white text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all ${!(state.team.find(m => m.id === state.currentUser)?.isCoordinator) ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'hover:border-purple-300'}`}
                                                     value={task.assignedToId || ''}
                                                     onChange={(e) => assignTask(task.id, e.target.value)}
                                                     disabled={!(state.team.find(m => m.id === state.currentUser)?.isCoordinator)}
                                                 >
                                                     <option value="">-- Seleccionar miembro --</option>
                                                     {state.team.map(m => (
                                                         <option key={m.id} value={m.id}>{m.name}</option>
                                                     ))}
                                                 </select>
                                             </td>
                                             <td className="p-4 text-center">
                                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${isExpanded ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                                                     {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                 </div>
                                             </td>
                                         </tr>
                                         {isExpanded && (
                                             <tr className="bg-slate-100/50">
                                                 <td colSpan={4} className="p-0">
                                                     <div className="p-6 border-t border-slate-200 space-y-6 animate-in slide-in-from-top-2">
                                                         {/* Propósito */}
                                                         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                 <Info size={12} className="text-blue-500" /> ¿Qué deben hacer?
                                                             </h5>
                                                             <p className="text-sm text-slate-700 font-medium">
                                                                 {task.description}
                                                             </p>
                                                         </div>

                                                         <div className="grid md:grid-cols-2 gap-6">
                                                             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                                 <Lightbulb size={12} className="text-amber-500" /> Puntos a describir
                                                             </h5>
                                                             <ul className="text-sm space-y-2 text-slate-700">
                                                                 {task.guidelines?.map((line, i) => (
                                                                     <li key={i} className="flex gap-2">
                                                                         <span className="text-purple-400 font-bold">•</span>
                                                                         <span>{line}</span>
                                                                     </li>
                                                                 ))}
                                                             </ul>
                                                         </div>
                                                         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                                                 <Info size={12} className="text-blue-500" /> Entregable esperado
                                                             </h5>
                                                             <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                                 {task.deliverable}
                                                             </p>
                                                             <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 italic">
                                                                 Pista: {task.deliverableHint}
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </td>
                                         </tr>
                                         )}
                                     </React.Fragment>
                                 );
                             })}
                         </tbody>
                     </table>
                 </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={() => setActiveTab('deliverable')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        Ver Entregable Final <CheckCircle size={20} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* TAB 2: DEVELOPMENT */}
      {activeTab === 'development' && (
        <div className="space-y-8">
            
            {/* Step 0: School Identity */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <span className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">0</span>
                     Identidad del Centro
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Centro Educativo</label>
                        <input 
                            type="text" 
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            onFocus={() => setFocusedField('schoolName')}
                            onBlur={() => { setFocusedField(null); updateSchoolSettings(schoolName, academicYear); }}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Curso Académico</label>
                         <input 
                            type="text" 
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            onFocus={() => setFocusedField('academicYear')}
                            onBlur={() => { setFocusedField(null); updateSchoolSettings(schoolName, academicYear); }}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Logo del Centro</label>
                        <div className="flex items-center gap-4">
                            {state.schoolLogo && (
                                <img src={state.schoolLogo} alt="Logo" className="h-12 w-12 object-contain" />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm flex items-center gap-2">
                                <Upload size={16} /> Subir Logo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'schoolLogo')} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Team Lock Button in Task 1 */}
                {state.team.find(m => m.id === state.currentUser)?.isCoordinator && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className={`p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 ${
                            state.isTeamClosed ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    state.isTeamClosed ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                }`}>
                                    {state.isTeamClosed ? <Lock size={24} /> : <Unlock size={24} />}
                                </div>
                                <div>
                                    <h4 className={`font-black ${state.isTeamClosed ? 'text-red-900' : 'text-green-900'}`}>
                                        {state.isTeamClosed ? 'Equipo Cerrado' : 'Equipo Abierto'}
                                    </h4>
                                    <p className={`text-sm ${state.isTeamClosed ? 'text-red-700' : 'text-green-700'}`}>
                                        {state.isTeamClosed 
                                            ? 'El equipo está sellado. Ya podéis comenzar con el reparto de tareas y la ejecución.' 
                                            : 'Cuando todos los miembros se hayan unido, cierra el equipo para desbloquear las siguientes tareas.'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    if (!state.isTeamClosed && state.team.length < 3) {
                                        alert("Se recomienda un mínimo de 3 miembros para cerrar el equipo.");
                                    }
                                    toggleTeamLock();
                                }}
                                className={`px-8 py-3 rounded-xl font-black transition-all shadow-lg flex items-center gap-2 ${
                                    state.isTeamClosed 
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20' 
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20'
                                }`}
                            >
                                {state.isTeamClosed ? <Unlock size={20} /> : <Lock size={20} />}
                                {state.isTeamClosed ? 'Abrir Equipo' : 'Cerrar Equipo y Comenzar'}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Step 1: Team */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                    Equipo y Roles
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Equipo</label>
                        <input 
                            type="text" 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            onFocus={() => setFocusedField('teamName')}
                            onBlur={() => { setFocusedField(null); updateTeamName(teamName); }}
                            placeholder="Ej: Los Innovadores del Sabor"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Foto de Grupo</label>
                         <div className="flex items-center gap-4">
                            {state.groupPhoto && (
                                <img src={state.groupPhoto} alt="Grupo" className="h-12 w-20 object-cover rounded" />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm flex items-center gap-2">
                                <ImageIcon size={16} /> Subir Foto
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'groupPhoto')} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Miembros (3-5 Personas) 
                        {state.isTeamClosed && <span className="ml-2 text-red-600 text-xs font-black uppercase tracking-widest">[EQUIPO CERRADO]</span>}
                    </label>
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                            placeholder={state.isTeamClosed ? "Equipo cerrado..." : "Nombre del alumno..."}
                            disabled={state.isTeamClosed}
                            className="flex-1 p-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button 
                            onClick={handleAddMember}
                            disabled={state.team.length >= 5 || state.isTeamClosed}
                            className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            <UserPlus size={20} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {state.team.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="coordinator"
                                        checked={member.isCoordinator}
                                        onChange={() => setCoordinator(member.id)}
                                        className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
                                    />
                                    <TeamMemberInput member={member} updateTeamMembers={updateTeamMembers} allTeam={state.team} />
                                    {member.isCoordinator && (
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">
                                            (Coord.)
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-600">
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                        {state.team.length === 0 && <p className="text-sm text-gray-400 italic">Añade a los miembros del equipo.</p>}
                    </div>
                </div>
            </section>

            {/* Step 2: Zone Selection */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                    Selección de Zona
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {ZONES.map((zone) => {
                        const isSelected = state.selectedZone?.id === zone.id;
                        const isExpanded = expandedZoneId === zone.id;
                        return (
                            <div 
                                key={zone.id}
                                onClick={() => selectZone(zone)}
                                className={`cursor-pointer rounded-lg border-2 p-4 transition-all flex flex-col ${
                                    isSelected 
                                    ? 'border-green-600 bg-green-50' 
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-gray-800">{zone.name}</h4>
                                    {isSelected && <CheckCircle size={20} className="text-green-600" />}
                                </div>
                                <p className="text-xs text-gray-500">{zone.territory}</p>
                                <p className="text-xs mt-2 font-medium text-green-700 mb-3">{zone.concept}</p>
                                
                                <div className="mt-auto">
                                    <button
                                        onClick={(e) => toggleZoneDetails(e, zone.id)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 focus:outline-none"
                                    >
                                        {isExpanded ? <><EyeOff size={14}/> Ocultar detalles</> : <><Eye size={14}/> Ver detalles</>}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 bg-white/60 rounded p-2" onClick={(e) => e.stopPropagation()}>
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Ingredientes Estrella:</p>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {zone.ingredients.map((ing, i) => (
                                                <span key={i} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                                                    {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Step 3: Justification */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
                    Justificación
                </h3>
                <label className="block text-sm text-gray-600 mb-2">
                    Explica brevemente por qué habéis elegido esa zona (2-3 líneas).
                </label>
                <textarea 
                    value={zoneJustification}
                    onChange={(e) => setZoneJustification(e.target.value)}
                    onFocus={() => setFocusedField('zoneJustification')}
                    onBlur={() => { setFocusedField(null); updateZoneJustification(zoneJustification); }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
                    placeholder="Ej: Hemos elegido el Mar Menor porque nos apasiona la cocina marinera..."
                />
            </section>

            <div className="flex justify-end mt-8">
                <button 
                    onClick={() => setActiveTab('distribution')}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    Siguiente: Reparto Global <Users size={20} />
                </button>
            </div>
        </div>
      )}

      {/* TAB 3: DELIVERABLE (PRINT VIEW) */}
      {activeTab === 'deliverable' && (
        <div className="flex flex-col items-center">
            <div className="mb-6 flex gap-4 no-print">
                 <button 
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Printer size={20} /> Imprimir Entregable
                </button>
            </div>

            {/* The Paper Sheet */}
            <div className="bg-white p-12 shadow-2xl w-full max-w-3xl min-h-[800px] print:shadow-none print:w-full print:p-0">
                {/* Standard Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-8">
                    <div className="flex items-center gap-4">
                        {state.schoolLogo && (
                            <img src={state.schoolLogo} alt="Logo Centro" className="h-16 w-auto object-contain" />
                        )}
                        {!state.schoolLogo && <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-gray-900">{state.schoolName}</h2>
                        <p className="text-sm text-gray-600">Curso {state.academicYear}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-1">Entregable Tarea 1</h1>
                    <h2 className="text-lg text-gray-600">Constitución del Equipo y Selección de Zona</h2>
                </div>

                <div className="space-y-8">
                    {/* Team Name */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-1">Nombre del Equipo</h3>
                        <div className="text-3xl font-serif text-gray-900 border-b border-gray-200 pb-2">
                            {state.teamName || <span className="text-gray-300 italic">Sin nombre definido</span>}
                        </div>
                    </div>

                    {/* Members & Photo */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Componentes del Equipo</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <ul className="space-y-3">
                                    {state.team.map((member, idx) => (
                                        <li key={member.id} className="flex items-center text-lg">
                                            <span className="w-8 text-gray-400 font-mono text-sm">{idx + 1}.</span>
                                            <span className={member.isCoordinator ? "font-bold text-gray-900" : "text-gray-700"}>
                                                {member.name}
                                            </span>
                                            {member.isCoordinator && (
                                                <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-bold uppercase tracking-wider">
                                                    Coordinador/a
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                    {state.team.length === 0 && <li className="text-gray-400 italic">No hay miembros en el equipo</li>}
                                </ul>
                            </div>
                            <div className="col-span-1">
                                {state.groupPhoto ? (
                                    <div className="border p-2 bg-white shadow-sm rotate-1">
                                        <img src={state.groupPhoto} alt="Equipo" className="w-full h-auto object-cover" />
                                        <p className="text-center text-xs mt-2 text-gray-500 font-serif">Nuestro Equipo</p>
                                    </div>
                                ) : (
                                    <div className="h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs text-center p-4">
                                        Sin foto de grupo
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Zona Gastronómica Seleccionada</h3>
                        <div className="text-2xl font-bold text-green-800">
                            {state.selectedZone?.name || <span className="text-gray-300">No seleccionada</span>}
                        </div>
                        {state.selectedZone && (
                            <p className="text-gray-500 italic mt-1">{state.selectedZone.territory}</p>
                        )}
                    </div>

                    {/* Justification */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Justificación de la Elección</h3>
                        <div className="p-4 border-l-4 border-gray-300 bg-gray-50 italic text-gray-700 min-h-[100px]">
                            {state.zoneJustification || "Sin justificación redactada."}
                        </div>
                    </div>

                    {/* Task Distribution */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Reparto Global de Tareas (Fase de Investigación)</h3>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 text-gray-700 font-bold">
                                    <tr>
                                        <th className="p-3 border-b border-gray-300">Micro-Tarea</th>
                                        <th className="p-3 border-b border-gray-300">Responsable</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {state.task2.tasks.map(task => {
                                        const assignee = state.team.find(m => m.id === task.assignedToId);
                                        return (
                                            <tr key={task.id}>
                                                <td className="p-3 font-medium text-gray-800">{task.title}</td>
                                                <td className="p-3 text-gray-700">{assignee?.name || <span className="text-red-400 italic">No asignado</span>}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                    <p>Murcia Sostenible - Fase 0</p>
                    <p>{new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};