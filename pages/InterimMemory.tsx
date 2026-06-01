
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Printer, Info, FileText, ChevronRight, Save, Eye } from 'lucide-react';
import { DishType } from '../types';

// Helper component for Academic Tables
const AcademicTable: React.FC<{ title: string; children: React.ReactNode; source?: string; className?: string }> = ({ title, children, source = "Elaboración propia", className = "" }) => (
    <div className={`academic-table-container break-inside-avoid mb-6 border border-black ${className}`}>
        <div className="bg-gray-100 border-b border-black p-2 font-bold text-sm uppercase tracking-wide print:bg-gray-100">
            {title}
        </div>
        <div className="p-0">
            {children}
        </div>
        <div className="p-1 text-[10px] italic text-gray-500 border-t border-black bg-white">
            Fuente: {source}
        </div>
    </div>
);

export const InterimMemory: React.FC = () => {
  const { state, updateInterimReport } = useProject();
  const { adminEditMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [activeReportSection, setActiveReportSection] = useState<string | null>('identidad');

  const handlePrint = () => {
    window.print();
  };

  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || adminEditMode || false;
  const isEditor = state.task6.editorIds.includes(state.currentUser || '') || adminEditMode;
  const canEditReport = isEditor || isCoordinator || (state.task6.editorIds.length === 0);

  const reportSections = [
    { id: 'identidad', label: '1. Identidad y Equipo (T1)', field: 'summary' },
    { id: 'analisis', label: '2. Análisis del Entorno (T2)', subfields: [
        { id: 'context', label: '2.1. Contexto y Justificación', parent: 'introduction' },
        { id: 'research', label: '2.2. Síntesis de Investigación Individual', parent: 'analysis.conclusions' },
    ]},
    { id: 'concepto', label: '3. Conceptualización (T2)', subfields: [
        { id: 'objectives', label: '3.1. Objetivos del Restaurante', parent: 'introduction' },
        { id: 'differentiation', label: '3.2. Propuesta de Valor y Diferenciación', parent: 'analysis.products' },
    ]},
    { id: 'gastronomia', label: '4. Oferta Gastronómica (T3)', field: 'results' },
    { id: 'desarrollo', label: '5. Desarrollo y Prototipo (T4)', subfields: [
        { id: 'methodology', label: '5.1. Metodología de Trabajo', parent: 'development' },
        { id: 'planning', label: '5.2. Planificación Temporal', parent: 'development' },
    ]},
    { id: 'viabilidad', label: '6. Viabilidad Económica (T6)', field: 'analysis.laborRisks' },
    { id: 'conclusiones', label: '7. Conclusiones y ODS', subfields: [
        { id: 'ods', label: '7.1. Relación con los ODS', parent: 'analysis.ods' },
        { id: 'conclusions', label: '7.2. Valoración Final', parent: 'analysis.conclusions' },
    ]},
    { id: 'bibliografia', label: '8. Bibliografía y Fuentes', field: 'bibliography' },
  ];

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const updateNestedValue = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    const last = parts.pop()!;
    const target = parts.reduce((acc, part) => acc[part], obj);
    target[last] = value;
    return { ...obj };
  };

  const getMemberBadge = (memberId: string | null) => {
      if (!memberId) return null;
      const member = state.team.find(m => m.id === memberId);
      if (!member) return null;
      return <span className="text-[10px] uppercase font-bold text-gray-500 ml-2">({member.name})</span>;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0 font-sans print:font-sans">
      
      {/* UI HEADER (NO PRINT) */}
      <div className="flex flex-col gap-4 mb-8 no-print print:hidden">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Tarea 6: Memoria Intermedia del Proyecto</h2>
                <p className="text-gray-500 mt-1 italic text-sm">Entrega parcial: Fase 1, 2 y 3</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('view')}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'view' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
                >
                    <Eye size={18} /> Vista Previa / PDF
                </button>
                <button 
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
                >
                    <FileText size={18} /> Redactar Memoria
                </button>
            </div>
        </div>

        {activeTab === 'view' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-1" />
                <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Estado del Proyecto:</p>
                    <p>Este documento es una versión preliminar que incluye los avances realizados hasta la <strong>Tarea 4</strong>. Los apartados de producción final y viabilidad económica se incluirán únicamente en la Memoria Final.</p>
                </div>
                <button 
                    onClick={handlePrint}
                    className="ml-auto bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 shrink-0"
                >
                    <Printer size={18} /> Imprimir PDF
                </button>
            </div>
        )}
      </div>

      {activeTab === 'edit' && (
          <div className="grid md:grid-cols-12 gap-8 no-print animate-fade-in">
              {/* Sidebar Navigation for Report */}
              <div className="md:col-span-4 space-y-2">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText size={18} className="text-blue-600" /> Secciones a Redactar
                      </h4>
                      <div className="space-y-1">
                          {reportSections.map(section => (
                              <button
                                  key={section.id}
                                  onClick={() => setActiveReportSection(section.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${activeReportSection === section.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                  <span>{section.label}</span>
                                  <ChevronRight size={14} className={activeReportSection === section.id ? 'opacity-100' : 'opacity-0'} />
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border text-sm ${canEditReport ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                      <p className="font-bold mb-1">{canEditReport ? '✓ Acceso de Escritura' : '⚠ Solo Lectura'}</p>
                      <p className="text-xs">{canEditReport ? 'Tus cambios se guardan automáticamente en tiempo real para todo el equipo.' : 'Solo el Coordinador o los Editores Jefes pueden modificar la memoria.'}</p>
                  </div>
              </div>

              {/* Content Area for Report Editing */}
              <div className="md:col-span-8">
                  <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
                      {reportSections.map(section => {
                          if (activeReportSection !== section.id) return null;

                          return (
                              <div key={section.id} className="animate-fade-in">
                                  <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{section.label}</h3>
                                  
                                  {section.field ? (
                                      <div className="space-y-4">
                                          <label className="block text-sm font-bold text-gray-700">Contenido de la sección</label>
                                          <textarea 
                                              className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[400px] leading-relaxed text-gray-700 ${!canEditReport ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                              placeholder={canEditReport ? `Redacta aquí el contenido para ${section.label}...` : "Solo Editores pueden redactar la memoria."}
                                              value={(state.interimReport as any)[section.field]}
                                              onChange={(e) => canEditReport && updateInterimReport({ [section.field!]: e.target.value })}
                                              disabled={!canEditReport}
                                          />
                                      </div>
                                  ) : (
                                      <div className="space-y-6">
                                          {section.subfields?.map(sub => (
                                              <div key={sub.id}>
                                                  <label className="block text-sm font-bold text-gray-700 mb-2">{sub.label}</label>
                                                  <textarea 
                                                      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px] leading-relaxed text-gray-700 ${!canEditReport ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                      placeholder={canEditReport ? `Escribe aquí...` : "Solo Editores pueden redactar la memoria."}
                                                      value={sub.parent ? getNestedValue(state.interimReport, `${sub.parent}.${sub.id}`) : (state.interimReport as any)[sub.id]}
                                                      onChange={(e) => {
                                                          if (!canEditReport) return;
                                                          if (sub.parent) {
                                                              const updatedReport = updateNestedValue({ ...state.interimReport }, `${sub.parent}.${sub.id}`, e.target.value);
                                                              updateInterimReport(updatedReport);
                                                          } else {
                                                              updateInterimReport({ [sub.id]: e.target.value });
                                                          }
                                                      }}
                                                      disabled={!canEditReport}
                                                  />
                                              </div>
                                          ))}
                                      </div>
                                  )}

                                  <div className="mt-8 flex justify-end">
                                      <button className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg border ${canEditReport ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                                          <Save size={18} /> {canEditReport ? 'Autoguardado activo' : 'Modo lectura'}
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}

      {/* DOCUMENT PREVIEW (VIEW TAB) */}
      {activeTab === 'view' && (
        <div className="bg-white p-12 shadow-2xl print:shadow-none print:p-0 min-h-screen">
        
            {/* === PORTADA === */}
            <div className="print:h-[270mm] print:flex print:flex-col print:justify-between break-after-page mb-20 print:mb-0 relative">
                <div className="border-b-[3px] border-black pb-6 mb-12">
                    <div className="flex items-center gap-6">
                        {state.schoolLogo ? (
                            <img src={state.schoolLogo} alt="Logo" className="h-24 w-auto object-contain" />
                        ) : (
                            <div className="h-20 w-20 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">Sin Logo</div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{state.schoolName}</h2>
                            <p className="text-lg text-gray-600 font-serif italic">Curso Académico {state.academicYear}</p>
                        </div>
                    </div>
                </div>

                <div className="text-center flex-grow flex flex-col justify-center items-center">
                    <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 font-bold text-sm uppercase tracking-[0.2em] mb-6 rounded">
                        Informe Intermedio de Progreso
                    </div>
                    <h1 className="text-6xl font-black text-green-900 mb-4 uppercase tracking-tighter leading-none print:text-7xl">
                        {state.concept.name || "NOMBRE DEL RESTAURANTE"}
                    </h1>
                    <p className="text-3xl text-gray-500 font-serif italic mb-12">"{state.concept.slogan || "Tu eslogan aquí"}"</p>
                    
                    {state.groupPhoto && (
                        <img src={state.groupPhoto} alt="Equipo" className="max-h-64 max-w-full object-contain border-4 border-white shadow-lg print:shadow-none print:border-none rounded-lg" />
                    )}
                </div>

                <div className="mt-12">
                    <div className="text-left mb-6">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">PROYECTO MURCIA SOSTENIBLE</p>
                        <p className="text-4xl font-bold text-gray-900">{state.teamName || "Nombre del Equipo"}</p>
                    </div>
                    
                    <div className="border-t-[3px] border-black pt-6">
                        <p className="font-bold mb-3 uppercase text-sm">Integrantes del Equipo:</p>
                        <div className="flex flex-col gap-1">
                            {state.team.map((m) => (
                                <div key={m.id} className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${m.isCoordinator ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {m.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-4">Fecha de generación: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* === ÍNDICE === */}
            <div className="break-after-page px-8 py-8 print:px-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 border-b-2 border-gray-200 pb-4">Índice del Informe Intermedio</h2>
                <ul className="space-y-6 text-xl">
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                        <span className="font-bold text-blue-900">1. El Concepto y la Identidad (Tarea 1)</span>
                        <span className="text-gray-400 text-sm">Completado</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                        <span className="font-bold text-blue-900">2. La Investigación (Tarea 2)</span>
                        <span className="text-gray-400 text-sm">Completado</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                        <span className="font-bold text-blue-900">3. Avance de la Oferta Gastronómica (Tarea 3)</span>
                        <span className="text-gray-400 text-sm">Completado</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                        <span className="font-bold text-blue-900">4. Prototipos y Diseño (Tarea 4)</span>
                        <span className="text-gray-400 text-sm">Completado</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                        <span className="font-bold text-blue-900">5. Memoria Intermedia (Tarea 5)</span>
                        <span className="text-gray-400 text-sm italic">Este documento</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2 opacity-50 italic">
                        <span className="font-bold">6. Viabilidad Económica (Tarea 6)</span>
                        <span className="text-gray-400 text-sm">Futuro</span>
                    </li>
                    <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2 opacity-30 italic">
                        <span className="font-bold">7. Producción Final (Tarea 7)</span>
                        <span className="text-gray-400 text-sm">Futuro</span>
                    </li>
                </ul>
            </div>

            {/* === CAPÍTULO 1 === */}
            <div className="break-before-page">
                <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8 text-blue-900">1. El Concepto</h2>
                
                <AcademicTable title="Tabla 1. Identidad Corporativa">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="w-1/3 bg-gray-50 font-bold p-3 border-r border-gray-200">Nombre Comercial</td>
                                <td className="p-3 font-medium text-lg">{state.concept.name}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="w-1/3 bg-gray-50 font-bold p-3 border-r border-gray-200">Eslogan</td>
                                <td className="p-3 italic">"{state.concept.slogan}"</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="w-1/3 bg-gray-50 font-bold p-3 border-r border-gray-200">Zona</td>
                                <td className="p-3">{state.selectedZone?.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </AcademicTable>

                <div className="mt-8 space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">1.1 Vinculación Territorial</h3>
                        <p className="text-justify leading-relaxed">
                            {state.zoneJustification || 'Pendiente de justificación.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* === CAPÍTULO 2 === */}
            <div className="break-before-page">
                <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8 text-blue-900">2. La Investigación</h2>
                <div className="space-y-8">
                    {state.task2.tasks.filter(t => t.content && t.content.length > 5).map((task) => (
                        <div key={task.id} className="break-inside-avoid">
                            <h4 className="font-bold text-lg bg-gray-100 p-2 border-l-4 border-blue-500 mb-2 flex justify-between">
                                <span>{task.title}</span>
                                {getMemberBadge(task.assignedToId)}
                            </h4>
                            <p className="text-sm text-justify leading-relaxed whitespace-pre-wrap pl-3">
                                {task.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* === CAPÍTULO 3 === */}
            <div className="break-before-page">
                <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8 text-blue-900">3. Avance de la Carta</h2>
                
                <AcademicTable title={`Resumen de la Oferta: ${state.concept.name}`}>
                    <div className="p-6">
                        {Object.values(DishType).map(type => {
                            const dishes = state.dishes.filter(d => d.type === type);
                            if (dishes.length === 0) return null;
                            return (
                                <div key={type} className="mb-6 break-inside-avoid last:mb-0">
                                    <h4 className="font-bold uppercase text-xs tracking-widest border-b border-gray-300 mb-3 pb-1 text-gray-500">{type}</h4>
                                    <ul className="space-y-2">
                                        {dishes.map(dish => (
                                            <li key={dish.id} className="flex justify-between items-baseline font-bold text-sm">
                                                <span>{dish.name}</span>
                                                <span className="text-gray-400 font-normal">{getMemberBadge(dish.author)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </AcademicTable>
            </div>

            {/* === CAPÍTULO 4 === */}
            <div className="break-before-page">
                <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8 text-blue-900">4. Fichas Técnicas Borrador</h2>
                
                <div className="space-y-8">
                    {state.dishes.map((dish) => (
                        <div key={dish.id} className="break-inside-avoid border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-lg">{dish.name}</h3>
                                {getMemberBadge(dish.author)}
                            </div>
                            <div className="text-xs bg-gray-50 p-4 border border-gray-200 rounded">
                                <p className="font-bold mb-1">Ingredientes Principales:</p>
                                <p className="mb-3 text-gray-600">{dish.ingredients.map(i => i.name).join(', ')}</p>
                                <p className="font-bold mb-1">Justificación Sostenible:</p>
                                <p className="italic text-gray-600">{dish.sustainabilityJustification || "No especificada."}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      )}
    </div>
  );
};
