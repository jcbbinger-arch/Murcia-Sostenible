import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PauseCircle, LogOut, Mail } from 'lucide-react';

export const SuspendedAccount: React.FC = () => {
  const { logout, profile } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <PauseCircle className="w-12 h-12 text-amber-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Cuenta Inactiva</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Hola <span className="font-bold text-slate-900">{profile?.displayName}</span>. Tu cuenta ha sido <span className="text-amber-600 font-bold">suspendida temporalmente</span> por el administrador del sistema.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 text-sm text-slate-700 text-left">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold uppercase tracking-wider text-[10px]">
            <Mail className="w-3 h-3" />
            ¿Qué puedo hacer?
          </div>
          <p className="mb-4 opacity-80">
            Si crees que esto es un error o deseas reactivar tu cuenta, por favor contacta con tu profesor o el administrador del centro.
          </p>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email de contacto:</p>
            <p className="font-mono text-slate-900">juan.codina@murciaeduca.es</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
