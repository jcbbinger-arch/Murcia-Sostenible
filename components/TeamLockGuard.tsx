
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Lock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeamLockGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useProject();
  const { profile, realProfile } = useAuth();
  const location = useLocation();
  
  const isAdmin = realProfile?.role === 'admin' || realProfile?.role === 'assistant';
  const isExecutionPath = [
    '/task-2', '/menu', '/task-4', '/financials', '/task-6', '/co-eval', '/memory', '/setup'
  ].some(path => location.pathname.startsWith(path));

  if (isExecutionPath && !state.isTeamClosed && !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Fase Bloqueada</h2>
          <p className="text-slate-600 mb-8 font-medium">
            Para comenzar con las tareas de ejecución, primero debéis terminar de incorporar a todos los miembros y <strong>cerrar el equipo</strong> en la Tarea 1.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/task-1" 
              className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Users size={20} /> Ir a Tarea 1
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
            >
              Volver al Panel
            </Link>
          </div>
          
          <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Solo el coordinador puede cerrar el equipo
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
