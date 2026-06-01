
import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Printer, Info } from 'lucide-react';
import { DishType } from '../types';

// Palette for team members to be used in badges
const MEMBER_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
];

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

// Helper component for Figures
const AcademicFigure: React.FC<{ src: string; alt: string; title: string; className?: string }> = ({ src, alt, title, className = "" }) => (
    <div className={`break-inside-avoid mb-6 text-center ${className}`}>
        <div className="border border-gray-300 p-1 inline-block bg-white shadow-sm print:shadow-none print:border-black">
            <img src={src} alt={alt} className="max-h-[300px] w-auto object-contain" />
        </div>
        <p className="text-xs font-bold mt-2 text-gray-700">{title}</p>
    </div>
);

export const FinalMemory: React.FC = () => {
  const { state } = useProject();

  const handlePrint = () => {
    window.print();
  };

  const getMemberBadge = (memberId: string | null) => {
      if (!memberId) return null;
      const member = state.team.find(m => m.id === memberId);
      if (!member) return null;
      return <span className="text-[10px] uppercase font-bold text-gray-500 ml-2">({member.name})</span>;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto print:max-w-none print:w-full print:p-0 print:m-0 font-sans print:font-sans">
      
      {/* UI HEADER (NO PRINT) */}
      <div className="flex flex-col gap-4 mb-8 no-print print:hidden">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900">Memoria Final del Proyecto</h2>
            <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md"
            >
                <Printer size={18} /> Imprimir PDF Oficial
            </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
            <Info className="text-yellow-600 shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
                <p className="font-bold mb-1">Formato Profesional Optimizado:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>La portada se ajusta automáticamente al folio A4.</li>
                    <li>Los capítulos inician en página nueva.</li>
                    <li>Las fichas técnicas y escandallos se agrupan inteligentemente para no dejar hojas vacías.</li>
                </ul>
            </div>
        </div>
      </div>

      {/* DOCUMENT BODY */}
      <div className="bg-white p-12 shadow-2xl print:shadow-none print:p-0 min-h-screen">
        
        {/* === PORTADA === */}
        <div className="print:h-[270mm] print:flex print:flex-col print:justify-between break-after-page mb-20 print:mb-0 relative">
            {/* Header Portada */}
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

            {/* Central Title */}
            <div className="text-center flex-grow flex flex-col justify-center items-center">
                <h1 className="text-6xl font-black text-green-900 mb-4 uppercase tracking-tighter leading-none print:text-7xl">
                    {state.concept.name || "NOMBRE DEL RESTAURANTE"}
                </h1>
                <p className="text-3xl text-gray-500 font-serif italic mb-12">"{state.concept.slogan || "Tu eslogan aquí"}"</p>
                
                {state.groupPhoto && (
                     <img src={state.groupPhoto} alt="Equipo" className="max-h-64 max-w-full object-contain border-4 border-white shadow-lg print:shadow-none print:border-none rounded-lg" />
                )}
            </div>

            {/* Footer Portada */}
            <div className="mt-12">
                <div className="text-left mb-6">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">PROYECTO MURCIA SOSTENIBLE</p>
                    <p className="text-4xl font-bold text-gray-900">{state.teamName || "Nombre del Equipo"}</p>
                </div>
                
                <div className="border-t-[3px] border-black pt-6">
                     <p className="font-bold mb-3 uppercase text-sm">Integrantes del Equipo:</p>
                     <div className="flex flex-col gap-1">
                        {state.team.map((m, idx) => (
                             <div key={m.id} className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${m.isCoordinator ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {m.name}
                                </span>
                             </div>
                        ))}
                     </div>
                     <p className="text-right text-xs text-gray-500 mt-4">Fecha de entrega: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        {/* === ÍNDICE === */}
        <div className="break-after-page px-8 py-8 print:px-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 border-b-2 border-gray-200 pb-4">Índice del Proyecto</h2>
            <ul className="space-y-6 text-xl">
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">1. El Concepto y la Identidad</span>
                    <span className="text-gray-400 text-sm">Identidad Corporativa, Público y Vinculación</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">2. La Investigación (Anexos)</span>
                    <span className="text-gray-400 text-sm">Estudio de Mercado y Entorno</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">3. Nuestra Carta Gastronómica</span>
                    <span className="text-gray-400 text-sm">Oferta Culinaria Resumida</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">4. Fichas Técnicas (Anexos)</span>
                    <span className="text-gray-400 text-sm">Recetario Profesional y Elaboración</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">5. Producción Final</span>
                    <span className="text-gray-400 text-sm">Diseño Visual y Prototipos</span>
                </li>
                <li className="flex items-baseline justify-between border-b border-dotted border-gray-300 pb-2">
                    <span className="font-bold">6. Viabilidad Económica</span>
                    <span className="text-gray-400 text-sm">Escandallos y Precios</span>
                </li>
            </ul>
        </div>

        {/* === CAPÍTULO 1 === */}
        <div className="break-before-page">
            <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">1. El Concepto</h2>
            
            <p className="mb-8 text-justify leading-relaxed">
                En este capítulo definimos la identidad corporativa y la vinculación territorial de nuestro proyecto,
                estableciendo las bases de nuestra propuesta de valor para la zona de <strong>{state.selectedZone?.name}</strong>.
            </p>

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
                            <td className="w-1/3 bg-gray-50 font-bold p-3 border-r border-gray-200">Zona Territorial</td>
                            <td className="p-3">{state.selectedZone?.name} ({state.selectedZone?.territory})</td>
                        </tr>
                        <tr>
                            <td className="w-1/3 bg-gray-50 font-bold p-3 border-r border-gray-200">Valores de Marca</td>
                            <td className="p-3">{state.concept.values.join(' • ')}</td>
                        </tr>
                    </tbody>
                </table>
            </AcademicTable>

            <div className="mt-8 space-y-6">
                <div className="break-inside-avoid">
                    <h3 className="font-bold text-lg mb-2 border-l-4 border-black pl-3">1.1 Público Objetivo</h3>
                    <p className="text-justify bg-gray-50 p-4 border border-gray-200 text-sm italic">
                        "{state.concept.targetAudience || 'Pendiente de definir.'}"
                    </p>
                </div>

                <div className="break-inside-avoid">
                    <h3 className="font-bold text-lg mb-2 border-l-4 border-black pl-3">1.2 Vinculación con {state.selectedZone?.name}</h3>
                    <p className="text-justify leading-relaxed">
                        {state.zoneJustification || 'Pendiente de justificación.'}
                    </p>
                </div>
            </div>
        </div>

        {/* === CAPÍTULO 2 === */}
        <div className="break-before-page">
             <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">2. La Investigación</h2>
             <p className="mb-8">A continuación, se presentan los resúmenes ejecutivos de las investigaciones realizadas por el equipo.</p>
             
             <div className="space-y-8">
                {state.task2.tasks.filter(t => t.content && t.content.length > 5).map((task) => (
                    <div key={task.id} className="break-inside-avoid">
                         <h4 className="font-bold text-lg bg-gray-100 p-2 border-l-4 border-blue-500 mb-2 flex justify-between">
                            <span>{task.title}</span>
                            {getMemberBadge(task.assignedToId)}
                         </h4>
                         <p className="text-sm text-justify leading-relaxed whitespace-pre-wrap pl-3 border-l border-gray-200">
                             {task.content}
                         </p>
                    </div>
                ))}
             </div>
        </div>

        {/* === CAPÍTULO 3 === */}
        <div className="break-before-page">
            <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">3. Nuestra Carta Gastronómica</h2>
            
            <AcademicTable title={`Tabla 2. Menú de Temporada: ${state.concept.name}`}>
                <div className="p-6">
                    {Object.values(DishType).map(type => {
                        const dishes = state.dishes.filter(d => d.type === type);
                        if (dishes.length === 0) return null;
                        return (
                            <div key={type} className="mb-6 break-inside-avoid last:mb-0">
                                <h4 className="font-bold uppercase text-xs tracking-widest border-b border-gray-300 mb-3 pb-1 text-gray-500">{type}</h4>
                                <ul className="space-y-4">
                                    {dishes.map(dish => (
                                        <li key={dish.id}>
                                            <div className="flex justify-between items-baseline font-bold text-base mb-1">
                                                <span>{dish.name}</span>
                                                <div className="flex-1 mx-2 border-b border-dotted border-gray-400 h-1"></div>
                                                <span>{dish.price > 0 ? dish.price.toFixed(2) + '€' : 'S/M'}</span>
                                            </div>
                                            {getMemberBadge(dish.author) && <div className="text-[10px] text-gray-400 uppercase font-bold mb-1 text-right">{getMemberBadge(dish.author)}</div>}
                                            <p className="text-sm text-gray-600 italic leading-snug">
                                                {dish.description}
                                            </p>
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
            <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">4. Fichas Técnicas</h2>
            
            <div className="space-y-8">
                {state.dishes.map((dish, idx) => (
                    <div key={dish.id} className="break-inside-avoid border-b-2 border-dashed border-gray-300 pb-8 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold text-lg">{dish.name} <span className="text-gray-500 font-normal text-sm">({dish.type})</span></h3>
                             {getMemberBadge(dish.author)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Columna Foto (si existe) */}
                            {dish.photo && (
                                <div className="md:col-span-1">
                                    <img src={dish.photo} alt={dish.name} className="w-full h-auto object-cover border border-gray-200 shadow-sm rounded-sm" />
                                </div>
                            )}

                            {/* Columna Técnica */}
                            <div className={dish.photo ? "md:col-span-2" : "md:col-span-3"}>
                                <AcademicTable title={`Ficha Técnica ${idx + 1}: ${dish.name}`}>
                                    <div className="grid grid-cols-2 divide-x divide-black text-xs">
                                        <div className="bg-gray-50 p-2 font-bold border-b border-black">Ingredientes</div>
                                        <div className="bg-gray-50 p-2 font-bold border-b border-black">Elaboración</div>
                                        
                                        <div className="p-3 align-top">
                                            <ul className="list-disc pl-4 space-y-1">
                                                {dish.ingredients.map((ing, i) => (
                                                    <li key={i}>{ing.quantity} {ing.unit} {ing.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="p-3 align-top whitespace-pre-wrap leading-relaxed">
                                            {dish.elaboration}
                                        </div>

                                        <div className="col-span-2 p-3 border-t border-black bg-gray-100">
                                            <strong>Justificación Sostenible:</strong> {dish.sustainabilityJustification || "No especificada."}
                                        </div>
                                    </div>
                                </AcademicTable>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* === CAPÍTULO 5 === */}
        <div className="break-before-page">
             <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">5. Producción Final</h2>
             
             <div className="grid md:grid-cols-2 gap-8">
                 <div className="break-inside-avoid">
                    <h3 className="font-bold text-lg mb-2">5.1 Identidad Visual</h3>
                    <div className="p-4 border border-gray-300 bg-gray-50 text-sm italic min-h-[100px]">
                        {state.menuPrototype.generalStyle || "No definida."}
                    </div>
                 </div>

                 <div className="break-inside-avoid">
                    <h3 className="font-bold text-lg mb-2">5.2 Carta Digital</h3>
                    <div className="p-4 border border-gray-300 bg-gray-50 text-sm">
                        Enlace al diseño: <br/>
                        <a href={state.menuPrototype.digitalLink} target="_blank" className="text-blue-600 font-bold underline break-all">{state.menuPrototype.digitalLink || "No disponible"}</a>
                        <p className="mt-2 text-xs text-gray-500">Responsables: {state.task6.designerIds.map(id => state.team.find(m => m.id === id)?.name).join(', ')}</p>
                    </div>
                 </div>
             </div>

             <div className="break-inside-avoid mt-8">
                 <h3 className="font-bold text-lg mb-2">5.3 Prototipo Físico</h3>
                 <p className="mb-4 text-justify">{state.menuPrototype.physicalDescription}</p>
                 
                 {state.menuPrototype.physicalPhoto && (
                     <AcademicFigure 
                        src={state.menuPrototype.physicalPhoto} 
                        alt="Prototipo Físico" 
                        title="Maqueta de la Carta Física" 
                        className="max-w-md mx-auto"
                     />
                 )}
                 <p className="text-xs text-gray-500 mt-2">Responsables: {state.task6.artisanIds.map(id => state.team.find(m => m.id === id)?.name).join(', ')}</p>
             </div>
        </div>

        {/* === CAPÍTULO 6 === */}
        <div className="break-before-page">
            <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-8">6. Viabilidad Económica</h2>
            
            <div className="space-y-8">
                {state.dishes.map((dish, idx) => (
                    <div key={dish.id} className="break-inside-avoid">
                        <div className="flex justify-between items-end mb-1">
                             <span className="text-xs text-gray-500 font-bold uppercase">{dish.type}</span>
                             {getMemberBadge(dish.author)}
                        </div>
                        <AcademicTable title={`Tabla ${13 + idx}. Escandallo: ${dish.name}`}>
                            <div className="text-sm">
                                <div className="grid grid-cols-2 border-b border-black">
                                    <div className="p-2 border-r border-black flex justify-between">
                                        <span className="font-bold">Coste Materia Prima Total:</span>
                                        <span>{dish.financials?.totalCost?.toFixed(2)}€</span>
                                    </div>
                                    <div className="p-2 flex justify-between bg-gray-50">
                                        <span className="font-bold">Coste por Ración:</span>
                                        <span>{dish.financials?.costPerServing?.toFixed(2)}€</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 border-b border-black">
                                    <div className="p-2 border-r border-black flex justify-between">
                                        <span className="font-bold">Food Cost %:</span>
                                        <span>{dish.financials?.foodCostPercent?.toFixed(2)}%</span>
                                    </div>
                                    <div className="p-2 flex justify-between bg-gray-50">
                                        <span className="font-bold">Margen Bruto:</span>
                                        <span>{dish.financials?.grossMargin?.toFixed(2)}€</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-100 border-b border-black text-center">
                                    <span className="font-bold text-lg">PVP Final: {dish.price?.toFixed(2)}€</span>
                                </div>
                                <div className="p-3 text-xs italic bg-white">
                                    <strong>Justificación de Precio:</strong> {dish.priceJustification || "Sin justificación."}
                                </div>
                            </div>
                        </AcademicTable>
                    </div>
                ))}
            </div>
        </div>
        
      </div>
    </div>
  );
};
