import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Search, Users, ShieldCheck } from 'lucide-react';

export const ConceptDefinition: React.FC = () => {
  const { state, updateConcept, updateMission } = useProject();
  const [activeTab, setActiveTab] = useState<'concept' | 'missions'>('concept');
  const [activeMission, setActiveMission] = useState<'explorer' | 'connector' | 'guardian'>('explorer');

  if (!state.selectedZone) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600">⚠️ Por favor selecciona una zona primero</h2>
        </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">2. Análisis y Conceptualización</h2>
        <p className="text-gray-600 mt-2">
            Define la identidad de tu restaurante basado en la zona <strong>{state.selectedZone.name}</strong>.
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
            onClick={() => setActiveTab('concept')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'concept' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            Concepto Grupal
        </button>
        <button
            onClick={() => setActiveTab('missions')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'missions' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            Misiones Individuales
        </button>
      </div>

      {activeTab === 'concept' ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Restaurante</label>
                    <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Ej: Raíces del Valle"
                        value={state.concept.name}
                        onChange={(e) => updateConcept('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Eslogan / Propuesta de Valor</label>
                    <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Ej: La tradición que no esperabas"
                        value={state.concept.slogan}
                        onChange={(e) => updateConcept('slogan', e.target.value)}
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Público Objetivo (Target)</label>
                <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
                    placeholder="Describe a tu cliente ideal (edad, intereses, tipo de visita...)"
                    value={state.concept.targetAudience}
                    onChange={(e) => updateConcept('targetAudience', e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valores (3 Adjetivos)</label>
                <div className="flex gap-4">
                    {[0, 1, 2].map((i) => (
                        <input 
                            key={i}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder={`Valor ${i + 1}`}
                            value={state.concept.values[i] || ''}
                            onChange={(e) => {
                                const newValues = [...state.concept.values];
                                newValues[i] = e.target.value;
                                updateConcept('values', newValues);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-2">
                <button 
                    onClick={() => setActiveMission('explorer')}
                    className={`w-full text-left p-4 rounded-lg flex items-center gap-3 transition ${activeMission === 'explorer' ? 'bg-green-100 text-green-800' : 'bg-white hover:bg-gray-50'}`}
                >
                    <Search size={18} /> Explorador
                </button>
                <button 
                    onClick={() => setActiveMission('connector')}
                    className={`w-full text-left p-4 rounded-lg flex items-center gap-3 transition ${activeMission === 'connector' ? 'bg-green-100 text-green-800' : 'bg-white hover:bg-gray-50'}`}
                >
                    <Users size={18} /> Conector
                </button>
                <button 
                    onClick={() => setActiveMission('guardian')}
                    className={`w-full text-left p-4 rounded-lg flex items-center gap-3 transition ${activeMission === 'guardian' ? 'bg-green-100 text-green-800' : 'bg-white hover:bg-gray-50'}`}
                >
                    <ShieldCheck size={18} /> Guardián
                </button>
            </div>

            <div className="md:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
                {activeMission === 'explorer' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4">Misión: El Explorador de Sabores</h3>
                        <div>
                            <label className="label">Mapa Gastronómico (Links o Nombres)</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded" 
                                rows={3}
                                value={state.missions.explorer?.mapUrl || ''}
                                onChange={(e) => updateMission('explorer', { mapUrl: e.target.value })}
                                placeholder="Lista 5 restaurantes de referencia en la zona..."
                            />
                        </div>
                        <div>
                            <label className="label">Análisis de Cartas</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded"
                                rows={4}
                                value={state.missions.explorer?.menuAnalysis || ''}
                                onChange={(e) => updateMission('explorer', { menuAnalysis: e.target.value })}
                                placeholder="¿Qué platos se repiten? ¿Precios medios?"
                            />
                        </div>
                    </div>
                )}
                {activeMission === 'connector' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4">Misión: El Conector de Personas</h3>
                        <div>
                            <label className="label">Mini-Encuesta (Resumen)</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded"
                                rows={4}
                                value={state.missions.connector?.surveyResults || ''}
                                onChange={(e) => updateMission('connector', { surveyResults: e.target.value })}
                                placeholder="Resultados de preguntar a 5 personas..."
                            />
                        </div>
                        <div>
                            <label className="label">Cliente Ideal</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded"
                                rows={3}
                                value={state.missions.connector?.idealCustomer || ''}
                                onChange={(e) => updateMission('connector', { idealCustomer: e.target.value })}
                                placeholder="Conclusión personal sobre quién es el cliente..."
                            />
                        </div>
                    </div>
                )}
                {activeMission === 'guardian' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg border-b pb-2 mb-4">Misión: El Guardián de la Despensa</h3>
                        <div>
                            <label className="label">Ingredientes y Temporada</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded"
                                rows={4}
                                value={state.missions.guardian?.ingredients || ''}
                                onChange={(e) => updateMission('guardian', { ingredients: e.target.value })}
                                placeholder="Lista 10-15 ingredientes locales y sus temporadas..."
                            />
                        </div>
                        <div>
                            <label className="label">Proveedores (Lonjas, Mercados)</label>
                            <textarea 
                                className="input-field w-full border p-2 rounded"
                                rows={3}
                                value={state.missions.guardian?.supplierInfo || ''}
                                onChange={(e) => updateMission('guardian', { supplierInfo: e.target.value })}
                                placeholder="¿Dónde compraríais?"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};