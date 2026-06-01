
import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Download, User, Users, CheckCircle, Activity, Globe, ShieldCheck, Clock } from 'lucide-react';

export const TeamSync: React.FC = () => {
  const { state } = useProject();
  const { profile } = useAuth();

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

  // Statistics
  const getMemberStats = (memberId: string) => {
      const dishes = state.dishes.filter(d => d.author === memberId).length;
      const tasks = state.task2.tasks.filter(t => t.assignedToId === memberId && t.content.trim().length > 10).length;
      const reviews = state.coEvaluations.filter(r => r.evaluatorId === memberId).length;
      return { dishes, tasks, reviews };
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Globe size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sincronización en Vivo</h2>
            <p className="text-slate-500 font-medium">Tu trabajo se guarda y sincroniza automáticamente con tu equipo.</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COL: STATUS & BACKUP */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" /> Estado del Sistema
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-sm font-bold text-emerald-800">Conexión</span>
                <span className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Activa
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">Base de Datos</span>
                <span className="text-xs font-black text-slate-900 uppercase">Firestore Realtime</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Seguridad</p>
              <button 
                onClick={handleBackup}
                className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-lg active:scale-95"
              >
                <Download size={20} /> Descargar Backup
              </button>
              <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed">
                Aunque la sincronización es automática, recomendamos descargar un backup al finalizar cada sesión importante.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Activity size={20} className="text-emerald-400" /> Resumen del Proyecto
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platos Creados</span>
                <span className="text-3xl font-black text-white">{state.dishes.length}</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tareas de Análisis</span>
                <span className="text-3xl font-black text-white">{state.task2.tasks.filter(t => t.content.length > 10).length} <span className="text-sm text-slate-500">/ 10</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coevaluaciones</span>
                <span className="text-3xl font-black text-white">{state.coEvaluations.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: TEAM ACTIVITY */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Users size={24} className="text-blue-500" /> Actividad del Equipo
              </h3>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {state.team.length} Miembros
              </div>
            </div>

            <div className="grid gap-4">
              {state.team.map(member => {
                const stats = getMemberStats(member.id);
                const isCurrent = state.currentUser === member.id;
                
                return (
                  <div key={member.id} className={`p-6 rounded-2xl border transition-all ${isCurrent ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500/10' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400'}`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-lg">{member.name}</span>
                            {member.isCoordinator && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Coordinador</span>}
                            {isCurrent && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Tú</span>}
                          </div>
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${stats.dishes > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs font-bold text-slate-500">{stats.dishes} platos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${stats.tasks > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs font-bold text-slate-500">{stats.tasks} tareas</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${stats.reviews > 0 ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs font-bold text-slate-500">{stats.reviews} eval.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sincronizado</span>
                        <CheckCircle size={14} className="text-emerald-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1">¿Cómo funciona la sincronización?</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Cualquier cambio que realices se envía automáticamente a la nube y se refleja en los dispositivos de tus compañeros en menos de un segundo. No necesitas guardar manualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
