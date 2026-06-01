import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, Users, Globe, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginWithRedirect } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      // Intentamos el pop-up directamente
      await login();
    } catch (err: any) {
      console.error("Login Error:", err);
      setIsLoggingIn(false);
      if (err.code === 'auth/popup-blocked') {
        setError("El navegador bloqueó la ventana. Prueba el botón 'Entrar por Redirección' de abajo.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError("Dominio no autorizado. Asegúrate de añadir este dominio en la consola de Firebase.");
      } else {
        setError("Error al iniciar sesión. Prueba el método de Redirección.");
      }
    }
  };

  const handleRedirectLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await loginWithRedirect();
    } catch (err: any) {
      console.error("Redirect Login Error:", err);
      setError("Error al iniciar la redirección.");
      setIsLoggingIn(false);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <Globe className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Murcia Sostenible</h1>
          <p className="text-slate-400 font-medium">Plataforma de Gestión de Proyectos</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black hover:bg-emerald-400 hover:text-slate-900 transition-all active:scale-95 shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <LogIn className="w-6 h-6" />
            )}
            {isLoggingIn ? 'Cargando...' : 'Entrar con Google (Pop-up)'}
          </button>

          <button
            onClick={handleRedirectLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-6 h-6" />
            Entrar por Redirección (Más fiable)
          </button>

          <div className="pt-4">
            <button
              onClick={openInNewTab}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all border border-slate-700 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en pestaña nueva
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-400">Si el Pop-up se bloquea, usa el botón de <b>Redirección</b>. Es el método más compatible con navegadores en incógnito.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
