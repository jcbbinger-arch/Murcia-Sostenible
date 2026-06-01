import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, ArrowRight, LogOut, Loader2 } from 'lucide-react';

export const ProjectAccess: React.FC = () => {
  const { createProject, joinProject } = useProject();
  const { logout, profile } = useAuth();
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const code = await createProject(projectName);
      setSuccessCode(code);
    } catch (err: any) {
      setError(err.message || "Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await joinProject(projectCode);
    } catch (err: any) {
      setError(err.message || "Código de proyecto inválido");
    } finally {
      setLoading(false);
    }
  };

  if (successCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Proyecto Creado!</h1>
          <p className="text-gray-600 mb-6">Comparte este código con tus compañeros para que se unan:</p>
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <span className="text-4xl font-mono font-bold tracking-widest text-emerald-600">{successCode}</span>
          </div>
          <p className="text-sm text-gray-500 mb-8 italic">El proyecto se cargará automáticamente en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Acceso a Proyecto</h1>
          <button onClick={logout} title="Cerrar sesión" className="text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {mode === 'select' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full flex items-center justify-between p-6 bg-emerald-50 border-2 border-emerald-100 rounded-2xl hover:border-emerald-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-emerald-900">Crear nuevo proyecto</p>
                  <p className="text-sm text-emerald-700">Inicia un proyecto desde cero</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full flex items-center justify-between p-6 bg-blue-50 border-2 border-blue-100 rounded-2xl hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-blue-900">Unirme a un equipo</p>
                  <p className="text-sm text-blue-700">Usa un código compartido</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ej: Restaurante Sostenible 2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading || !projectName.trim()}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código de Proyecto</label>
              <input
                type="text"
                required
                maxLength={6}
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl font-mono tracking-widest uppercase"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex-1 px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading || projectCode.length < 6}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Unirme'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
