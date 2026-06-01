import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, LogOut } from 'lucide-react';

export const WaitingRoom: React.FC = () => {
  const { logout, profile } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sala de Espera</h1>
        <p className="text-gray-600 mb-8">
          Hola <span className="font-semibold">{profile?.displayName}</span>. Tu cuenta ha sido registrada correctamente, pero aún debe ser aprobada por el profesor.
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800 text-left">
          <p className="font-medium mb-1">¿Qué sigue?</p>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            <li>El profesor validará tu acceso pronto.</li>
            <li>Una vez aprobado, podrás unirte a un equipo.</li>
            <li>No es necesario que cierres esta ventana.</li>
          </ul>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
