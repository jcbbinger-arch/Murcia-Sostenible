import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, Globe, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { auth } from '../firebase';

export const Login: React.FC = () => {
  const { login, loginWithRedirect } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isIframe = window.location !== window.parent.location;

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      // Intentamos el pop-up directamente
      await login();
    } catch (err: any) {
      console.error("Login Error:", err);
      setIsLoggingIn(false);
      
    const domain = window.location.hostname;
    const authDomain = auth.app.options.authDomain;

    if (err.code === 'auth/popup-blocked') {
      setError(`El navegador bloqueó la ventana emergente. Prueba el botón 'Entrar por Redirección' o pulsa 'Abrir en pestaña nueva'.`);
    } else if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized domain'))) {
      setError(`DOMINIO NO AUTORIZADO: Debes añadir "${domain}" y "${authDomain}" en la consola de Firebase.`);
    } else if (err.code === 'auth/popup-closed-by-user') {
      setError("Cerraste la ventana de Google antes de terminar.");
    } else if (err.code === 'auth/internal-error' || err.code === 'auth/network-request-failed') {
      setError("Error de red o configuración de Firebase. Revisa tu conexión y los dominios autorizados.");
    } else {
      setError(`Error (${err.code || 'unknown'}): ${err.message || 'Error al iniciar sesión'}.`);
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
      const domain = window.location.hostname;
      const authDomain = auth.app.options.authDomain;
      setError(`La redirección falló. Asegúrate de que "${domain}" y "${authDomain}" están autorizados en Firebase.`);
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

        {isIframe && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-2xl text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold mb-1 underline">MODO IFRAME DETECTADO</p>
              <p>Google bloquea el inicio de sesión dentro de otras webs por seguridad. Por favor, pulsa <b>"Abrir en pestaña nueva"</b> para poder entrar.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] text-slate-400 uppercase tracking-wider">
              <p className="font-bold mb-2 text-emerald-400">PASOS PARA SOLUCIONAR (FIREBASE):</p>
              <p className="mb-2 text-[9px] lowercase italic text-slate-500">Ve a Authentication &gt; Settings &gt; Authorized domains y añade:</p>
              <div className="space-y-1 mb-4 select-all">
                <div className="bg-black/20 p-2 rounded border border-white/5 font-mono text-white normal-case">{window.location.hostname}</div>
                <div className="bg-black/20 p-2 rounded border border-white/5 font-mono text-white normal-case">{auth.app.options.authDomain}</div>
              </div>
              <ul className="list-decimal list-inside space-y-1">
                <li>Asegúrate de que Google esté HABILITADO.</li>
                <li>Si estás en Vercel, añade tu dominio .vercel.app</li>
                <li>Pulsa "Redirección" si nada de esto ayuda.</li>
              </ul>
            </div>
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
