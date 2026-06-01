
import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { AlertTriangle, Save, MessageSquare, Lock, Printer, CheckCircle } from 'lucide-react';
import { PeerReview, RubricItem } from '../types';

interface RubricRowProps {
    category: 'participation' | 'responsibility' | 'collaboration' | 'contribution';
    title: string;
    description: string;
    score: number;
    justification: string;
    onUpdate: (category: 'participation' | 'responsibility' | 'collaboration' | 'contribution', field: 'score' | 'justification', value: any) => void;
}

const RubricRow: React.FC<RubricRowProps> = ({ 
    category, 
    title, 
    description,
    score, 
    justification, 
    onUpdate 
}) => {
    // Helper para visualizar el color según la puntuación
    const getScoreColor = (val: number) => {
        if (val > 0) return 'text-green-600';
        if (val < 0) return 'text-red-600';
        return 'text-gray-400';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {category === 'participation' ? '1' : category === 'responsibility' ? '2' : category === 'collaboration' ? '3' : '4'}
                </span>
                {title}
            </h4>
            <p className="text-sm text-gray-500 mb-6 ml-10">{description}</p>
            
            <div className="ml-2 mr-2 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
                    <span className="text-red-500">Negativo (-0.25)</span>
                    <span className="text-gray-500">Neutro (0)</span>
                    <span className="text-green-500">Positivo (+0.25)</span>
                </div>
                <input 
                    type="range" 
                    min="-0.25" 
                    max="0.25" 
                    step="0.01" 
                    value={score}
                    onChange={(e) => onUpdate(category, 'score', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="text-center mt-2 font-mono font-bold text-lg">
                    <span className={getScoreColor(score)}>
                        {score > 0 ? '+' : ''}{score.toFixed(2)} Puntos
                    </span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} /> Justificación Obligatoria
                </label>
                <textarea 
                    className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                    placeholder={`Justifica tu puntuación para ${title}...`}
                    value={justification}
                    onChange={(e) => onUpdate(category, 'justification', e.target.value)}
                />
            </div>
        </div>
    );
};

export const CoEvaluation: React.FC = () => {
  const { state, savePeerReview } = useProject();
  const [targetId, setTargetId] = useState<string>('');

  const emptyItem: RubricItem = { score: 0, justification: '' };
  
  const [form, setForm] = useState<{
      participation: RubricItem;
      responsibility: RubricItem;
      collaboration: RubricItem;
      contribution: RubricItem;
  }>({
      participation: { ...emptyItem },
      responsibility: { ...emptyItem },
      collaboration: { ...emptyItem },
      contribution: { ...emptyItem },
  });

  // Current user logic
  const me = state.team.find(m => m.id === state.currentUser);
  const teammates = state.team.filter(m => m.id !== state.currentUser);
  
  // FIX: Use useEffect to sync form data whenever targetId OR global state changes
  useEffect(() => {
    if (!targetId || !state.currentUser) return;

    const existingReview = state.coEvaluations.find(
        r => r.evaluatorId === state.currentUser && r.targetId === targetId
    );

    if (existingReview) {
        setForm(existingReview.items);
    } else {
        // Reset to empty if no review exists for this person
        setForm({
            participation: { score: 0, justification: '' },
            responsibility: { score: 0, justification: '' },
            collaboration: { score: 0, justification: '' },
            contribution: { score: 0, justification: '' },
        });
    }
  }, [targetId, state.coEvaluations, state.currentUser]);

  // Check if saved for visual feedback (derived directly from state)
  const isSaved = (tId: string) => {
      return state.coEvaluations.some(r => r.evaluatorId === state.currentUser && r.targetId === tId);
  }

  const handleTargetChange = (id: string) => {
      setTargetId(id);
  };

  const updateItem = (category: keyof typeof form, field: 'score' | 'justification', value: any) => {
      setForm(prev => ({
          ...prev,
          [category]: {
              ...prev[category],
              [field]: value
          }
      }));
  };

  const handleSave = () => {
      if (!state.currentUser) return;
      if (!targetId) return;

      const categories = ['participation', 'responsibility', 'collaboration', 'contribution'] as const;
      for (const cat of categories) {
          if (Math.abs(form[cat].score) > 0 && form[cat].justification.trim().length < 5) {
               return;
          }
      }

      const review: PeerReview = {
          evaluatorId: state.currentUser,
          targetId,
          timestamp: Date.now(),
          items: form
      };

      savePeerReview(review);
  };

  const handlePrintPrivate = () => {
      window.print();
  };

  const translateCategory = (cat: string) => {
      switch(cat) {
          case 'participation': return 'Participación';
          case 'responsibility': return 'Responsabilidad';
          case 'collaboration': return 'Colaboración';
          case 'contribution': return 'Aportación Final';
          default: return cat;
      }
  };

  const currentTotalScore = form.participation.score + form.responsibility.score + form.collaboration.score + form.contribution.score;

  if (!state.currentUser) {
       return (
          <div className="p-8 text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800">Identificación Requerida</h2>
              <p className="text-gray-600 mb-4">Debes identificarte en el Panel Principal para evaluar a tus compañeros.</p>
          </div>
      )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto print:max-w-none print:p-0 print:m-0 print:w-full font-sans">
      
      {/* UI INTERACTIVA (SE OCULTA AL IMPRIMIR) */}
      <div className="print:hidden">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">⚖️</span> Coevaluación Diabólica
            </h2>
            <p className="text-gray-600 mt-2">
                Evaluación confidencial del desempeño. Desliza las barras para ajustar la puntuación (Total: +/- 1 punto).
            </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 text-sm text-red-800 flex items-start gap-4 rounded-r-xl shadow-sm">
            <Lock className="shrink-0 mt-1 text-red-600" size={24} />
            <div>
                <h3 className="font-black text-lg mb-1 uppercase tracking-tight">Zona de Alta Confidencialidad</h3>
                <p className="leading-relaxed">
                    <strong>Privacidad Estricta:</strong> Esta evaluación es 100% privada. Los compañeros <strong>NO</strong> pueden ver tus notas ni tus comentarios. 
                    Esta información solo es accesible para el profesor a través del informe global que debes imprimir al finalizar.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold bg-red-100 w-fit px-3 py-1 rounded-full border border-red-200">
                    <AlertTriangle size={14} /> NO compartas tu pantalla mientras realizas esta tarea.
                </div>
            </div>
        </div>

        <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-3">Selecciona compañero a evaluar:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {teammates.map(member => {
                    const saved = isSaved(member.id);
                    return (
                        <button
                            key={member.id}
                            onClick={() => handleTargetChange(member.id)}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                                targetId === member.id 
                                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-blue-300 text-gray-600'
                            }`}
                        >
                            {saved && (
                                <div className="absolute top-2 right-2 text-green-500 bg-white rounded-full">
                                    <CheckCircle size={20} fill="currentColor" className="text-green-100" />
                                </div>
                            )}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <span className="font-bold">{member.name}</span>
                            {saved && <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide">Guardado</span>}
                        </button>
                    );
                })}
            </div>
            {teammates.length === 0 && <p className="text-gray-400 italic">No tienes compañeros de equipo registrados.</p>}
        </div>

        {targetId && (
            <div className="animate-fade-in pb-32">
                <RubricRow 
                    category="participation" 
                    title="Participación" 
                    description="Asistencia, aportación de ideas, discusiones constructivas."
                    score={form.participation.score}
                    justification={form.participation.justification}
                    onUpdate={updateItem}
                />
                <RubricRow 
                    category="responsibility" 
                    title="Responsabilidad" 
                    description="Cumplimiento de plazos, calidad del trabajo individual, autonomía."
                    score={form.responsibility.score}
                    justification={form.responsibility.justification}
                    onUpdate={updateItem}
                />
                <RubricRow 
                    category="collaboration" 
                    title="Colaboración" 
                    description="Ayuda a compañeros, resolución de conflictos, actitud positiva."
                    score={form.collaboration.score}
                    justification={form.collaboration.justification}
                    onUpdate={updateItem}
                />
                <RubricRow 
                    category="contribution" 
                    title="Aportación Final" 
                    description="Valor real de su trabajo para el éxito del proyecto."
                    score={form.contribution.score}
                    justification={form.contribution.justification}
                    onUpdate={updateItem}
                />

                {/* FOOTER FLOTANTE */}
                <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex justify-between items-center z-20">
                    <div className="pl-4">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Impacto Total en Nota</div>
                        <div className={`text-2xl font-black ${currentTotalScore > 0 ? 'text-green-600' : currentTotalScore < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                            {currentTotalScore > 0 ? '+' : ''}{currentTotalScore.toFixed(2)} Puntos
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handlePrintPrivate}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-bold shadow-md"
                        >
                            <Printer size={18} /> Imprimir Informe Global
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg transform active:scale-95 transition-transform"
                        >
                            <Save size={18} /> Guardar Evaluación
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* DISEÑO DE IMPRESIÓN OFICIAL (COHERENTE CON MEMORIA FINAL) */}
      <div className="hidden print:block w-full">
            
            {/* === CABECERA COMPACTA (Sustituye a Portada Completa) === */}
            <div className="border-b-4 border-black pb-4 mb-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {state.schoolLogo && (
                            <img src={state.schoolLogo} alt="Logo" className="h-16 w-auto object-contain" />
                        )}
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{state.schoolName}</h2>
                            <p className="text-xs text-gray-600 italic">Curso {state.academicYear}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-xl font-black text-black uppercase tracking-tight">INFORME DE COEVALUACIÓN</h1>
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">CONFIDENCIAL - SOLO PROFESOR</p>
                    </div>
                </div>
                
                <div className="mt-4 flex justify-between items-end bg-gray-50 p-3 border border-gray-200 rounded-lg">
                    <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Proyecto / Equipo:</p>
                        <p className="text-sm font-bold text-black">{state.teamName} - <span className="italic">"{state.concept.name || 'Proyecto Sin Nombre'}"</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-500 uppercase mb-0.5">Evaluador:</p>
                        <p className="text-sm font-bold text-black">{me?.name}</p>
                    </div>
                </div>
            </div>

            {/* LISTADO DE EVALUACIONES COMPACTO */}
            <div className="space-y-4">
                {teammates.map((mate) => {
                    const review = state.coEvaluations.find(r => r.evaluatorId === state.currentUser && r.targetId === mate.id);
                    const hasReview = !!review;
                    const items = review?.items;
                    const totalScore = items ? (items.participation.score + items.responsibility.score + items.collaboration.score + items.contribution.score) : 0;

                    return (
                        <div key={mate.id} className="break-inside-avoid border-2 border-black rounded-xl overflow-hidden shadow-sm">
                            
                            {/* Header Ficha Compacto */}
                            <div className="bg-black text-white p-2 px-4 flex justify-between items-center">
                                <h3 className="font-black text-sm uppercase tracking-wider">EVALUADO: {mate.name}</h3>
                                <div className="flex items-center gap-3">
                                     <span className="text-[9px] uppercase font-bold text-gray-400">Impacto Total:</span>
                                     <span className={`text-lg font-black ${totalScore < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {totalScore > 0 ? '+' : ''}{totalScore.toFixed(2)}
                                     </span>
                                </div>
                            </div>

                            {/* Comentarios Compactos */}
                            <div className="p-3 bg-white">
                            {hasReview && items ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'participation', label: '1. Participación' },
                                        { key: 'responsibility', label: '2. Responsabilidad' },
                                        { key: 'collaboration', label: '3. Colaboración' },
                                        { key: 'contribution', label: '4. Aportación Final' }
                                    ].map((cat) => {
                                        const item = items[cat.key as keyof typeof items] as RubricItem;
                                        return (
                                            <div key={cat.key} className="bg-gray-50 p-2 rounded border border-gray-100">
                                                <div className="flex justify-between items-center mb-1 border-b border-gray-200 pb-1">
                                                    <h4 className="font-bold text-[9px] uppercase text-gray-600">
                                                        {cat.label}
                                                    </h4>
                                                    <span className="font-mono font-bold text-[9px] text-gray-900">
                                                        {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] leading-tight text-gray-700 italic">
                                                    "{item.justification || 'Sin justificación'}"
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-400 text-xs italic">
                                    -- Evaluación pendiente --
                                </div>
                            )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Footer de Página */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-[8px] text-gray-400 uppercase font-bold tracking-widest">
                <span>Murcia Sostenible - Gestor de Proyecto</span>
                <span>Emitido el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</span>
                <span>Página 1 de 1</span>
            </div>
      </div>
    </div>
  );
};
