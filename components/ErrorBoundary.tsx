import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ha ocurrido un error inesperado.";
      let isPermissionError = false;

      try {
        const parsedError = JSON.parse(this.state.error?.message || '{}');
        if (parsedError.error && parsedError.error.includes('insufficient permissions')) {
          errorMessage = "No tienes permisos suficientes para realizar esta acción.";
          isPermissionError = true;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">¡Ups! Algo salió mal</h2>
            <p className="text-slate-600 mb-8">
              {errorMessage}
            </p>
            {isPermissionError && (
              <p className="text-xs text-slate-400 mb-8 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                Asegúrate de estar usando la cuenta de administrador principal para gestionar usuarios.
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
