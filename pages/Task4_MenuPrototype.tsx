
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Palette, ExternalLink, Upload, PenTool, Layout, Eye, Save } from 'lucide-react';
import { SaveButton } from '../components/SaveButton';

export const Task4_MenuPrototype: React.FC = () => {
  const { state, updateMenuPrototype } = useProject();
  const { adminEditMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'instructions' | 'development'>('instructions');

  // PERMISOS
  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || adminEditMode || false;
  const isDesigner = state.task6.designerIds.includes(state.currentUser || '') || adminEditMode;
  const isArtisan = state.task6.artisanIds.includes(state.currentUser || '') || adminEditMode;

  // Si no hay roles asignados aún, permitimos al coordinador o a todos 
  const canEditDigital = isDesigner || isCoordinator || (state.task6.designerIds.length === 0);
  const canEditPhysical = isArtisan || isCoordinator || (state.task6.artisanIds.length === 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMenuPrototype({ physicalPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 4: Prototipos</h2>
            <p className="text-gray-600 mt-2">Diseño Visual de la Carta</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('development')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'development' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Prototipo
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 no-print">
             <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Tarea 4: Prototipado de la Carta</h3>
             
             <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 mb-8">
                <h4 className="text-blue-900 font-bold mt-0">¿Qué deben hacer?</h4>
                <p className="text-sm">Diseñar visualmente la carta en soporte digital y físico, reflejando el concepto y la identidad del restaurante.</p>
             </div>

             <div className="prose max-w-none text-gray-700 space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-green-900 mt-0">Objetivo</h4>
                    <p>Diseñar una primera versión (un prototipo) de los soportes visuales de vuestra oferta gastronómica.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layout className="text-purple-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.A: Digital</h4>
                        </div>
                        <p className="text-sm">Crear un borrador de la carta virtual (ej: Canva) que sea visualmente atractivo y coherente.</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                         <div className="flex items-center gap-2 mb-4">
                            <PenTool className="text-orange-600" />
                            <h4 className="font-bold text-lg m-0">Misión 4.B: Físico</h4>
                        </div>
                        <p className="text-sm">Crear un boceto o maqueta de cómo sería la carta física (formato, materiales, texturas).</p>
                    </div>
                </div>

                 <div className="flex justify-center mt-6">
                    <button onClick={() => setActiveTab('development')} className="bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-green-700">
                        Comenzar Desarrollo
                    </button>
                 </div>
             </div>
        </div>
      )}

      {activeTab === 'development' && (
        <div className="space-y-8 no-print">
            
            <div className={`bg-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-50 border border-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-200 p-4 rounded-lg flex items-center gap-3`}>
                <Eye className={`text-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-600`} />
                <p className={`text-sm text-${(canEditDigital && canEditPhysical) ? 'blue' : 'orange'}-800`}>
                    <strong>Modo Colaborativo:</strong> {(canEditDigital && canEditPhysical) ? 'Tienes acceso para editar los prototipos del equipo.' : 'Solo los miembros asignados (Diseñadores/Artesanos) o el Coordinador pueden editar.'}
                </p>
            </div>

            {/* General Style */}
            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                {!isCoordinator && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                        <Palette size={14} /> Solo Coordinador
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-gray-500" /> Identidad Visual General
                </h3>
                <label className="block text-sm text-gray-600 mb-2">Explica brevemente la idea visual general (colores, tipografías, materiales que evocan la zona...)</label>
                <textarea 
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 min-h-[100px] ${!isCoordinator ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder={isCoordinator ? "Ej: Usaremos tonos ocres y verdes para recordar a la huerta..." : "Solo el Coordinador puede editar esta sección."}
                    value={state.menuPrototype.generalStyle}
                    onChange={(e) => isCoordinator && updateMenuPrototype({ generalStyle: e.target.value })}
                    disabled={!isCoordinator}
                />
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Digital */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                    {!canEditDigital && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            <Layout size={14} /> Solo Diseñadores
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                        <Layout size={20} /> Misión 4.A (Digital)
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-lg mb-4 text-sm text-purple-800">
                        Pega aquí el enlace de "Solo lectura" de tu diseño en Canva.
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Enlace Canva (Link Público)</label>
                    <div className="flex gap-2">
                        <input 
                            type="url"
                            className={`flex-1 p-2 border border-gray-300 rounded ${!canEditDigital ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder={canEditDigital ? "https://www.canva.com/..." : "Solo Diseñadores pueden editar."}
                            value={state.menuPrototype.digitalLink}
                            onChange={(e) => canEditDigital && updateMenuPrototype({ digitalLink: e.target.value })}
                            disabled={!canEditDigital}
                        />
                        {state.menuPrototype.digitalLink && (
                            <a 
                                href={state.menuPrototype.digitalLink} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </section>

                {/* Physical */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
                    {!canEditPhysical && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            <PenTool size={14} /> Solo Artesanos
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <PenTool size={20} /> Misión 4.B (Físico)
                    </h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto del Boceto / Maqueta</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 min-h-[200px]">
                            {state.menuPrototype.physicalPhoto ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={state.menuPrototype.physicalPhoto} 
                                        alt="Boceto Carta" 
                                        className="w-full h-48 object-contain rounded" 
                                    />
                                    {canEditPhysical && (
                                        <button 
                                            onClick={() => updateMenuPrototype({ physicalPhoto: null })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center text-gray-500 ${canEditPhysical ? 'cursor-pointer hover:text-orange-600' : 'cursor-not-allowed'}`}>
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm font-bold">{canEditPhysical ? 'Subir Foto' : 'Solo Artesanos'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={!canEditPhysical} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Explicación del Formato Físico</label>
                        <textarea 
                             className={`w-full p-2 border border-gray-300 rounded ${!canEditPhysical ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                             rows={3}
                             placeholder={canEditPhysical ? "Ej: Será un díptico en papel reciclado con textura..." : "Solo Artesanos pueden editar."}
                             value={state.menuPrototype.physicalDescription}
                             onChange={(e) => canEditPhysical && updateMenuPrototype({ physicalDescription: e.target.value })}
                             disabled={!canEditPhysical}
                        />
                    </div>
                </section>
            </div>
        </div>
      )}
      <SaveButton />
    </div>
  );
};
