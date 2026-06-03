
import React, { useRef, useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, FileText, User, LogIn, Download, Hash, Copy, CheckCircle2, GraduationCap, UserPlus, Loader2, Clock, Circle, ClipboardList, Lock, Unlock, Edit2, Save } from 'lucide-react';
import { ChecklistStatus } from '../types';
import { db, doc, updateDoc, OperationType, handleFirestoreError } from '../firebase';
import { TeamPanel } from '../components/TeamPanel';

export const Dashboard: React.FC = () => {
  const { state, setCurrentUser, claimTeamMember, joinTeamAsNewMember, updateChecklistItem, updateTeamMembers } = useProject();
  const { profile, user, realProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newMemberName, setNewMemberName] = useState(profile?.displayName || '');
  const [isJoining, setIsJoining] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // LOGIC: Check if current user is already in the team
  const isMember = state.team.some(m => m.id === profile?.uid);
  const actualIsAdmin = realProfile?.role === 'admin' || realProfile?.role === 'assistant';
  const isImpersonating = !!realProfile?.impersonatingUid;
  const needsIdentity = !isMember && state.team.length > 0 && !actualIsAdmin && !isImpersonating;

  // Auto-set currentUser if already a member or if impersonating
  useEffect(() => {
    const isImpersonating = !!realProfile?.impersonatingUid;
    if ((isMember || isImpersonating) && profile?.uid && state.currentUser !== profile.uid) {
      setCurrentUser(profile.uid);
    }
  }, [isMember, profile?.uid, state.currentUser, setCurrentUser, realProfile]);

  const isPlaceholder = (id: string) => id.length < 20; // Firebase UIDs are 28 chars

  const handleBackup = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = state.teamName ? state.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'proyecto';
    const date = new Date().toISOString().slice(0, 10);
    
    link.href = url;
    link.download = `BACKUP_MURCIA_${safeName}_${date}.json`;
    link.click();
  };

  const copyCode = () => {
    if (state.code) {
      navigator.clipboard.writeText(state.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIdentitySelect = async (id: string) => {
      if (isPlaceholder(id)) {
          setIsJoining(true);
          try {
            await claimTeamMember(id);
          } finally {
            setIsJoining(false);
          }
      } else {
          setCurrentUser(id);
      }
  };

  const handleJoinAsNew = async () => {
      if (!newMemberName.trim()) return;
      if (state.isTeamClosed) {
          alert("El equipo está cerrado y no se pueden añadir más miembros.");
          return;
      }
      setIsJoining(true);
      try {
          await joinTeamAsNewMember(newMemberName);
      } finally {
          setIsJoining(false);
      }
  };

  const handleUpdateName = () => {
    if (!tempName.trim() || !state.currentUser) return;
    const updatedTeam = state.team.map(m => 
      m.id === state.currentUser ? { ...m, name: tempName } : m
    );
    updateTeamMembers(updatedTeam);
    setIsEditingName(false);
  };

  const startEditing = () => {
    const currentMember = state.team.find(m => m.id === state.currentUser);
    if (currentMember) {
      setTempName(currentMember.name);
      setIsEditingName(true);
    }
  };

  // --- RENDER: IDENTITY LOCK SCREEN ---
  if (needsIdentity) {
      const placeholders = state.team.filter(m => isPlaceholder(m.id));
      const canJoinNew = state.team.length < 5;

      return (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 text-center animate-fade-in border border-white/20">
                  <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                      <User size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">¡Bienvenido al Equipo!</h2>
                  <p className="text-slate-600 mb-10 text-lg font-medium">
                      Estás en el proyecto <strong className="text-emerald-600">{state.name || state.teamName}</strong>. <br/>
                      Identifícate con uno de los nombres pre-creados o únete como nuevo miembro.
                  </p>
                  
                  <div className="space-y-8">
                    {placeholders.length > 0 && (
                        <div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 text-left">Nombres disponibles en el equipo:</h3>
                            <div className="grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {placeholders.map(member => (
                                    <button
                                        key={member.id}
                                        disabled={isJoining}
                                        onClick={() => handleIdentitySelect(member.id)}
                                        className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-lg group-hover:bg-emerald-200 group-hover:text-emerald-800 transition-colors">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <span className="block font-black text-slate-900 text-lg">{member.name}</span>
                                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Este soy yo</span>
                                            </div>
                                        </div>
                                        {isJoining ? <Loader2 className="animate-spin text-emerald-500" /> : <LogIn className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {canJoinNew && !state.isTeamClosed && (
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 text-left">O únete como nuevo miembro:</h3>
                            <div className="flex gap-3">
                                <input 
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    placeholder="Tu nombre..."
                                    className="flex-1 px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                                />
                                <button
                                    onClick={handleJoinAsNew}
                                    disabled={isJoining || !newMemberName.trim()}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isJoining ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
                                    Unirme
                                </button>
                            </div>
                        </div>
                    )}

                    {!canJoinNew && placeholders.length === 0 && (
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-700">
                            <p className="font-bold">El equipo está completo y todos los nombres están ocupados.</p>
                            <p className="text-sm">Contacta con el coordinador de tu equipo si hay algún error.</p>
                        </div>
                    )}
                  </div>

                  <p className="mt-10 text-sm text-slate-400 font-bold uppercase tracking-widest">
                      Tu progreso se guardará automáticamente
                  </p>
              </div>
          </div>
      );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sincronización en Tiempo Real Activa
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Panel de Gestión <span className="text-emerald-600">Murcia Sostenible</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Bienvenido, <span className="text-slate-900 font-bold">{profile?.displayName}</span>. 
            Gestiona tu proyecto de restauración sostenible de forma colaborativa.
        </p>

        {/* Grading System Explanation */}
        {!state.isTeamClosed && !actualIsAdmin && (
          <div className="max-w-4xl mx-auto bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-8 text-left shadow-sm mb-12 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-amber-900 tracking-tight">Fase de Constitución Activa</h3>
                <p className="text-sm text-amber-700 font-medium">El equipo aún está abierto. Debéis terminar de incorporar a todos los miembros antes de comenzar las tareas.</p>
              </div>
            </div>
            <Link 
              to="/task-1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
            >
              Ir a Tarea 1 y Cerrar Equipo <ArrowRight size={18} />
            </Link>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-left shadow-sm mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <GraduationCap className="text-emerald-600" size={32} />
                Sistema de Calificación (2 Fases)
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                            <h4 className="font-bold text-slate-900">Resultado de Equipo (Máx. 6 pts)</h4>
                            <p className="text-sm text-slate-500">Evaluación y calificación basada en las rúbricas y realizada por el profesor/a.</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                            <h4 className="font-bold text-slate-900">Contribución Individual (Máx. 4 pts)</h4>
                            <ul className="text-sm text-slate-500 space-y-2 mt-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>Hasta 3 puntos:</strong> Valoración de la exposición, defensa y contribución individual ante los profesores.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span><strong>1 punto adicional:</strong> "Coevaluación Diabólica". Valoración de los compañeros sobre tu participación real.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 italic">
                * La Coevaluación Diabólica puede ser un punto positivo o negativo. El profesor revisa las justificaciones y decide su efectividad para ajustar la nota individual.
            </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* PROJECT INFO CARD */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:rotate-12 transition-transform">
                  <FileText size={32} />
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{state.name || 'Proyecto sin nombre'}</h3>
              <p className="text-slate-500 font-medium mb-8">Información general del equipo</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Código de Equipo</span>
                  <button 
                    onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-mono font-black text-emerald-600 hover:border-emerald-500 transition-all active:scale-95"
                  >
                    <Hash size={16} />
                    {state.code}
                    {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Miembros</span>
                  <span className="font-black text-slate-900">{state.team.length} / 5</span>
                </div>
              </div>

              <Link 
                to="/task-1"
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                  Configurar Equipo <ArrowRight size={20} />
              </Link>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
              
              <h3 className="text-3xl font-black mb-2 tracking-tight">Acciones Rápidas</h3>
              <p className="text-slate-400 font-medium mb-10">Herramientas de gestión y backup</p>
              
              <div className="grid gap-4">
                <button 
                  onClick={handleBackup}
                  className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Download size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Descargar Backup</p>
                      <p className="text-xs text-slate-400">Copia de seguridad en formato JSON</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </button>

                <Link 
                  to="/academic-guide"
                  className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Guía Académica</p>
                      <p className="text-xs text-slate-400">Consulta los requisitos del proyecto</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                </Link>
              </div>
          </div>
      </div>

      <TeamPanel members={state.team} />

      {/* Progress Checklist Section */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Progreso del Proyecto</h3>
              <p className="text-sm text-slate-500 font-medium">Marca los hitos conforme los vayáis completando.</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {state.checklist.filter(i => i.status === 'completed').length} / {state.checklist.length} Completados
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.checklist.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                item.status === 'completed' 
                  ? 'bg-emerald-50/30 border-emerald-100' 
                  : item.status === 'in_progress'
                    ? 'bg-blue-50/30 border-blue-100'
                    : 'bg-white border-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`text-sm font-bold leading-tight ${
                  item.status === 'completed' ? 'text-emerald-900' : 'text-slate-700'
                }`}>
                  {item.label}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shrink-0 ${
                  item.category === 'group' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {item.category === 'group' ? 'Equipo' : 'Individual'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(['not_started', 'in_progress', 'completed'] as ChecklistStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateChecklistItem(item.id, status)}
                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${
                      item.status === status
                        ? status === 'completed'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : status === 'in_progress'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-400 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                    }`}
                    title={status === 'completed' ? 'Completado' : status === 'in_progress' ? 'En progreso' : 'Sin empezar'}
                  >
                    {status === 'completed' ? <CheckCircle2 size={14} /> : status === 'in_progress' ? <Clock size={14} /> : <Circle size={14} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {state.currentUser && (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 font-black text-2xl shadow-inner">
                      {state.team.find(m => m.id === state.currentUser)?.name.charAt(0)}
                  </div>
                  <div>
                      <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mb-1">Sesión Activa</p>
                      <div className="flex items-center gap-3">
                          {isEditingName ? (
                              <div className="flex items-center gap-2">
                                  <input 
                                      type="text"
                                      value={tempName}
                                      onChange={(e) => setTempName(e.target.value)}
                                      className="bg-slate-50 border border-emerald-200 rounded-lg px-3 py-1 text-lg font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                      autoFocus
                                  />
                                  <button 
                                      onClick={handleUpdateName}
                                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                                      title="Guardar nombre"
                                  >
                                      <Save size={18} />
                                  </button>
                                  <button 
                                      onClick={() => setIsEditingName(false)}
                                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                      title="Cancelar"
                                  >
                                      <Unlock size={18} className="text-emerald-500" />
                                  </button>
                              </div>
                          ) : (
                              <div className="flex items-center gap-3">
                                  <p className="text-2xl font-black text-slate-900">
                                      Hola, {state.team.find(m => m.id === state.currentUser)?.name}
                                  </p>
                                  <button 
                                      onClick={startEditing}
                                      className="group flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
                                      title="Cambiar mi nombre"
                                  >
                                      <Lock size={16} className="text-red-500 group-hover:hidden" />
                                      <Unlock size={16} className="text-emerald-500 hidden group-hover:block" />
                                      <Edit2 size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  {actualIsAdmin && (
                    <div className="flex flex-col items-end mr-4 pr-4 border-r border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Modo Administrador: Ver como...</p>
                      <div className="flex gap-2">
                        {state.team.map(m => (
                          <button
                            key={m.id}
                            onClick={() => setCurrentUser(m.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              state.currentUser === m.id 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-right hidden lg:block">
                      <p className="text-sm font-bold text-slate-900">Tu trabajo se sincroniza en vivo</p>
                      <p className="text-xs text-slate-400 font-medium">Última actualización: hace un momento</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link 
                      to="/task-2"
                      className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
                    >
                        Ir a la Tarea 2 <ArrowRight size={18} />
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm("¿Estás seguro de que quieres abandonar este proyecto? Perderás el acceso a menos que vuelvas a usar el código.")) {
                          // We can use a context function if we had one, or just updateDoc here
                          updateDoc(doc(db, 'users', user!.uid), { projectId: null }).catch(err => {
                            handleFirestoreError(err, OperationType.UPDATE, `users/${user!.uid}`);
                          });
                        }
                      }}
                      className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-all"
                    >
                      Abandonar Proyecto Actual
                    </button>
                  </div>
              </div>
          </div>
      )}
      {!state.currentUser && actualIsAdmin && state.team.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Modo Administrador</p>
              <p className="text-xs text-amber-700">Selecciona un perfil para ver el proyecto desde su perspectiva.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {state.team.map(m => (
              <button
                key={m.id}
                onClick={() => setCurrentUser(m.id)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

