import React from 'react';
import { ZONES } from '../constants';
import { useProject } from '../context/ProjectContext';
import { CheckCircle } from 'lucide-react';

export const ZoneSelection: React.FC = () => {
  const { state, selectZone } = useProject();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">1. Selección de Zona Gastronómica</h2>
        <p className="text-gray-600 mt-2">
          Elige una de las 10 despensas de la Región de Murcia. Esta decisión marcará la identidad de tu restaurante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ZONES.map((zone) => {
            const isSelected = state.selectedZone?.id === zone.id;
            return (
                <div 
                    key={zone.id}
                    onClick={() => selectZone(zone)}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 p-6 h-full flex flex-col ${
                        isSelected 
                        ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-500 ring-offset-2' 
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
                    }`}
                >
                    {isSelected && (
                        <div className="absolute top-4 right-4 text-green-600">
                            <CheckCircle size={24} fill="currentColor" className="text-white" />
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Zona {zone.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{zone.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium italic">{zone.territory}</p>
                    
                    <div className="mb-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-1">Concepto Clave</p>
                        <p className="text-gray-700 font-medium">{zone.concept}</p>
                    </div>

                    <div className="mt-auto">
                        <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Ingredientes Estrella</p>
                        <div className="flex flex-wrap gap-2">
                            {zone.ingredients.slice(0, 4).map((ing, i) => (
                                <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-600">
                                    {ing}
                                </span>
                            ))}
                            {zone.ingredients.length > 4 && (
                                <span className="text-xs text-gray-400 px-1 py-1">+{zone.ingredients.length - 4} más</span>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};