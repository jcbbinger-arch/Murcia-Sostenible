
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Lightbulb, Printer, ChevronDown, ChevronUp, Lock, AlertTriangle, Save, CheckCircle, Image as ImageIcon, Trash, Info } from 'lucide-react';

export const Task2_Analysis: React.FC = () => {
  const { state, updateTaskContent, updateConcept } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'execution' | 'concept' | 'deliverable'>('instructions');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handlePrint = () => window.print();

  // Helper to count tasks per member
  const getTaskCount = (memberId: string) => state.task2.tasks.filter(t => t.assignedToId === memberId).length;

  // PERMISOS: Solo el coordinador puede editar la parte grupal
  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || false;

  const handleSaveConcept = () => {
    // Visual feedback for the user (data is already in state/localStorage via onChange)
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 2: Análisis</h2>
            <p className="text-gray-600 mt-2">Fase 1 - Inmersión | Entrega: Finales Octubre</p>
        </div>
        <div className="flex flex-wrap gap-2">
            {[
                { id: 'instructions', label: '1. Instrucciones' },
                { id: 'execution', label: '2. Investigación' },
                { id: 'concept', label: '3. Decisión' },
                { id: 'deliverable', label: '4. Entregable' },
            ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        activeTab === tab.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-500 hover:bg-gray-100 border'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* TAB 1: INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Guía de Micro-tareas para los Alumnos</h3>
            <div className="prose max-w-none text-gray-700 space-y-6">
                 <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <h4 className="font-bold text-blue-900 text-lg mb-2">Objetivo del Proyecto</h4>
                    <p className="text-blue-800">Convertiros en expertos de la zona elegida de la Región de Murcia para diseñar un restaurante 100% sostenible y coherente con el entorno. Cada micro-tarea es una pieza clave para el éxito del entregable final.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                             <CheckCircle size={18} className="text-green-500" /> Dinámica de Trabajo
                        </h4>
                        <ul className="text-sm space-y-2">
                            <li><strong>Asignación:</strong> El coordinador debe repartir las 10 tareas entre los miembros.</li>
                            <li><strong>Investigación:</strong> Cada alumno completa sus puntos en la pestaña "Investigación".</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                             <CheckCircle size={18} className="text-green-500" /> Resultado Final
                        </h4>
                        <ul className="text-sm space-y-2">
                            <li><strong>Grupal:</strong> Definición del concepto, valores y marca.</li>
                            <li><strong>Individual:</strong> Cada alumno genera su propio anexo de investigación basado en sus hallazgos.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Contenido de la Investigación</h4>
                    <p className="text-sm text-gray-600 mb-4">Debéis profundizar en los 10 puntos clave: competencia, cartas, reputación, clientes (locales y turistas), catálogo de productos de temporada, productores Km0, medidas de sostenibilidad, benchmarking de innovación y tendencias visuales.</p>
                </div>
            </div>
        </div>
      )}

      {/* TAB 2: EXECUTION */}
      {activeTab === 'execution' && (
        <div className="space-y-4">
             <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200 flex items-center justify-between">
                <p className="text-sm text-green-800">
                    <CheckCircle className="inline-block mr-2 text-green-600" size={18} />
                    <strong>Zona de trabajo individual:</strong> Completa los puntos de tu tarea asignada.
                    {state.currentUser && <span> Estás identificado como: <strong>{state.team.find(m => m.id === state.currentUser)?.name}</strong></span>}
                </p>
             </div>
             
             {state.task2.tasks.map(task => {
                const assignee = state.team.find(m => m.id === task.assignedToId);
                const isExpanded = expandedTask === task.id;
                const isCompleted = task.content.length > 20;
                
                // LOCK LOGIC: Only the assigned member can edit. If not assigned or no user, it's locked.
                const isLocked = !state.currentUser || task.assignedToId !== state.currentUser; 

                return (
                    <div key={task.id} className={`bg-white border rounded-xl transition-all ${isExpanded ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
                        <div 
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? 'bg-green-100 text-green-700 shadow-inner' : 'bg-gray-100 text-gray-500'}`}>
                                    {task.id}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        {task.title}
                                        {isLocked && <Lock size={14} className="text-gray-400" />}
                                        {isCompleted && !isExpanded && <CheckCircle size={14} className="text-green-500" />}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                        Responsable: <span className={assignee ? "text-blue-600" : "text-gray-400"}>{assignee ? assignee.name : 'Pendiente de asignar'}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!isExpanded && (
                                    <div className="hidden sm:block text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">
                                        {task.deliverableHint}
                                    </div>
                                )}
                                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="p-6 border-t bg-slate-50 rounded-b-xl space-y-6">
                                {/* Propósito de la tarea */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <Info size={12} className="text-blue-500" /> ¿Qué debes hacer?
                                    </h5>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        {task.description}
                                    </p>
                                </div>

                                {/* Guías y Entregable */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <Lightbulb size={12} className="text-amber-500" /> Puntos a describir
                                        </h5>
                                        <ul className="text-sm space-y-2 text-slate-700">
                                            {task.guidelines?.map((line, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span>{line}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <CheckCircle size={12} className="text-emerald-500" /> Entregable esperado
                                        </h5>
                                        <p className="text-sm text-slate-700 font-medium">
                                            {task.deliverable}
                                        </p>
                                        <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] text-slate-400 italic">
                                            <span>Sugerencia: {task.deliverableHint}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Area de Texto */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tu Informe:</label>
                                        {isLocked && (
                                            <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold uppercase ring-1 ring-amber-200 px-2 py-0.5 rounded-full bg-amber-50">
                                                <Lock size={10} /> Solo lectura
                                            </div>
                                        )}
                                    </div>
                                    <textarea 
                                        className={`w-full p-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[250px] shadow-inner text-sm leading-relaxed ${isLocked ? 'bg-gray-100 cursor-not-allowed text-gray-500 italic' : 'bg-white'}`}
                                        placeholder={isLocked ? "Identifícate como el compañero asignado para editar esta tarea..." : "Desarrolla aquí los puntos solicitados anteriormente..."}
                                        value={task.content}
                                        onChange={(e) => updateTaskContent(task.id, e.target.value)}
                                        disabled={isLocked}
                                    />
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">
                                        <span>Última sincronización automática</span>
                                        <span>{task.content.length} caracteres redactados</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
             })}
        </div>
      )}

      {/* TAB 4: CONCEPTUALIZATION */}
      {activeTab === 'concept' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" /> Decisión Grupal: El Concepto
                </h3>
                {!isCoordinator && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                        <Lock size={14} /> Solo el Coordinador puede editar
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-6 italic">
                {isCoordinator 
                    ? "Como coordinador/a, eres responsable de registrar la identidad final del restaurante acordada por el equipo."
                    : "Aquí puedes ver la identidad del restaurante definida por tu equipo (solo el coordinador/a puede modificarla)."}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Restaurante</label>
                    <input 
                        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Ej: Raíces del Valle"
                        value={state.concept.name}
                        onChange={(e) => updateConcept('name', e.target.value)}
                        disabled={!isCoordinator}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Logo del Restaurante (Opcional)</label>
                    <div className="flex items-center gap-4">
                        {state.concept.restaurantLogo ? (
                            <div className="relative group">
                                <img src={state.concept.restaurantLogo} alt="Logo" className="h-16 w-16 object-contain border rounded bg-gray-50" />
                                {isCoordinator && (
                                    <button 
                                        onClick={() => updateConcept('restaurantLogo', null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash size={12} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <label className={`flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg transition-all ${isCoordinator ? 'cursor-pointer hover:border-blue-500 hover:bg-blue-50' : 'bg-gray-50 cursor-not-allowed'}`}>
                                <ImageIcon className="text-gray-400" size={24} />
                                {isCoordinator && (
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    updateConcept('restaurantLogo', reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                )}
                            </label>
                        )}
                        <span className="text-xs text-gray-400">Sube el logo de tu marca si ya lo tienes diseñado.</span>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Propuesta de Valor (Eslogan)</label>
                 <input 
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="El eslogan que os define..."
                    value={state.concept.slogan}
                    onChange={(e) => updateConcept('slogan', e.target.value)}
                    disabled={!isCoordinator}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Público Objetivo Final</label>
                <textarea 
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    value={state.concept.targetAudience}
                    onChange={(e) => updateConcept('targetAudience', e.target.value)}
                    disabled={!isCoordinator}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valores (3 Adjetivos)</label>
                <div className="flex gap-4">
                    {[0, 1, 2].map((i) => (
                        <input 
                            key={i}
                            className={`flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder={`Valor ${i + 1}`}
                            value={state.concept.values[i] || ''}
                            onChange={(e) => {
                                const newValues = [...state.concept.values];
                                newValues[i] = e.target.value;
                                updateConcept('values', newValues);
                            }}
                            disabled={!isCoordinator}
                        />
                    ))}
                </div>
            </div>

            {/* SAVE BUTTON SECTION */}
            {isCoordinator && (
                <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6">
                    {showSaveSuccess && (
                        <div className="flex items-center gap-2 text-green-600 font-bold animate-pulse">
                            <CheckCircle size={20} />
                            <span>¡Cambios guardados correctamente!</span>
                        </div>
                    )}
                    <button 
                        onClick={handleSaveConcept}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-md transition-all bg-green-600 text-white hover:bg-green-700 hover:scale-105"
                    >
                        <Save size={20} /> Guardar Decisión
                    </button>
                </div>
            )}
        </div>
      )}

      {/* TAB 5: DELIVERABLE */}
      {activeTab === 'deliverable' && (
        <div className="flex flex-col items-center">
             <div className="mb-6 flex gap-4 no-print">
                 <button 
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Printer size={20} /> Imprimir Entregable Tarea 2
                </button>
            </div>

            <div className="bg-white p-12 shadow-2xl w-full max-w-4xl min-h-[1000px] print:shadow-none print:w-full print:p-0">
                {/* Standard Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-8">
                    <div className="flex items-center gap-4">
                        {state.schoolLogo && (
                            <img src={state.schoolLogo} alt="Logo Centro" className="h-16 w-auto object-contain" />
                        )}
                        {!state.schoolLogo && <div className="h-16 w-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-gray-900">{state.schoolName}</h2>
                        <p className="text-sm text-gray-600">Curso {state.academicYear}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-1">Tarea 2</h1>
                    <h2 className="text-xl text-gray-600">Análisis del Entorno y Conceptualización</h2>
                    <p className="mt-2 text-sm text-gray-500">Equipo: {state.teamName} | Alumno: {state.team.find(m => m.id === state.currentUser)?.name || 'Sin identificar'}</p>
                </div>

                {/* PART 1: GROUP CONCEPT (NOW FIRST) */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Parte 1: Ficha de Conceptualización (Grupal)</h3>
                    
                    <div className="border-2 border-gray-800 p-8 rounded-lg bg-white relative overflow-hidden">
                        {state.concept.restaurantLogo && (
                            <div className="absolute top-4 right-4 opacity-20">
                                <img src={state.concept.restaurantLogo} alt="Logo" className="h-24 w-auto grayscale" />
                            </div>
                        )}
                        <div className="grid gap-8 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Nombre del Restaurante</h4>
                                    <div className="text-3xl font-serif text-gray-900">{state.concept.name || "____________________"}</div>
                                </div>
                                {state.concept.restaurantLogo && (
                                    <img src={state.concept.restaurantLogo} alt="Logo" className="h-20 w-auto object-contain" />
                                )}
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Concepto Principal / Eslogan</h4>
                                <div className="text-xl text-gray-800 italic">"{state.concept.slogan || "____________________"}"</div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Público Objetivo Final</h4>
                                <div className="text-md text-gray-700 border p-4 rounded bg-gray-50 min-h-[80px]">
                                    {state.concept.targetAudience || "Definición pendiente."}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Valores Fundamentales</h4>
                                <div className="flex gap-4">
                                    {state.concept.values.map((val, i) => (
                                        <div key={i} className="flex-1 border p-3 text-center font-bold bg-blue-50 rounded">
                                            {val || `Valor ${i+1}`}
                                        </div>
                                    ))}
                                    {state.concept.values.length === 0 && <span className="text-gray-400">Sin valores definidos.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-break" />

                {/* PART 2: INDIVIDUAL RESEARCH (NOW SECOND) */}
                <div className="break-before-page">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">Parte 2: Anexos de Investigación (Individual)</h3>
                    <p className="text-sm text-gray-600 mb-4 italic">Informes asignados a: {state.team.find(m => m.id === state.currentUser)?.name}</p>
                    
                    <div className="space-y-6">
                        {state.task2.tasks
                            .filter(task => task.assignedToId === state.currentUser)
                            .map(task => (
                                <div key={task.id} className="break-inside-avoid mb-6 bg-gray-50 p-4 rounded border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                                        <span className="text-xs bg-white px-2 py-1 rounded border">
                                            ID Tarea: {task.id}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {task.content || <span className="text-gray-400 italic">Contenido no completado.</span>}
                                    </p>
                                </div>
                            ))
                        }
                        {state.task2.tasks.filter(task => task.assignedToId === state.currentUser).length === 0 && (
                            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-400 italic">No tienes tareas de investigación asignadas en el reparto global.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                     Murcia Sostenible - Fase 1
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
