
import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Dish, IngredientRow } from '../types';
import { BookOpen, Calculator, Save, AlertTriangle } from 'lucide-react';
import { SaveButton } from '../components/SaveButton';

export const Task5_Financials: React.FC = () => {
  const { state, updateDish } = useProject();
  const { adminEditMode } = useAuth();
  const [activeTab, setActiveTab] = useState<'instructions' | 'calculator'>('instructions');
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [currentDish, setCurrentDish] = useState<Dish | null>(null);

  // PERMISOS
  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || adminEditMode || false;
  const availableDishes = state.dishes;
  const isAuthor = currentDish?.author === state.currentUser || adminEditMode;
  const canEdit = isAuthor || isCoordinator;

  useEffect(() => {
    if (selectedDishId) {
      const dish = state.dishes.find(d => d.id === selectedDishId);
      if (dish) {
        // Clonamos para evitar mutaciones directas en el estado global hasta guardar
        setCurrentDish(JSON.parse(JSON.stringify(dish)));
      } else {
          setCurrentDish(null);
      }
    } else {
      setCurrentDish(null);
    }
  }, [selectedDishId, state.dishes]);

  const handleIngredientChange = (id: string, field: keyof IngredientRow, value: any) => {
    if (!currentDish) return;
    
    const updatedIngredients = currentDish.ingredients.map(ing => {
        if (ing.id === id) {
            const updated = { ...ing, [field]: value };
            // Cálculo automático de apoyo al cambiar cantidad o precio
            if (field === 'quantity' || field === 'unitPrice') {
                updated.totalCost = Number(((updated.quantity || 0) * (updated.unitPrice || 0)).toFixed(2));
            }
            return updated;
        }
        return ing;
    });

    setCurrentDish({ ...currentDish, ingredients: updatedIngredients });
  };

  const handleFinancialInput = (field: keyof typeof currentDish.financials, value: number) => {
      if (!currentDish) return;
      setCurrentDish({
          ...currentDish,
          financials: {
              ...currentDish.financials,
              [field]: value
          }
      });
  };

  const saveEscandallo = () => {
      if (currentDish) {
          updateDish({
              ...currentDish,
              cost: currentDish.financials.totalCost,
              price: currentDish.price
          });
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tarea 7: Viabilidad Económica</h2>
            <p className="text-gray-600 mt-1">Gestión de costes y escandallos para la memoria final.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'instructions' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
            >
                <BookOpen size={18} /> Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('calculator')}
                className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
            >
                <Calculator size={18} /> Escandallos
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
             <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-100 pb-4 mb-8">Tarea 7: Viabilidad y Escandallos</h3>
             <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 mb-8">
                <h4 className="text-blue-900 font-bold mt-0">¿Qué deben hacer?</h4>
                <p className="text-sm">Realizar el cálculo económico de cada plato creado en la Tarea 3. Debéis aseguraros de que el restaurante es rentable manteniendo los valores de sostenibilidad.</p>
             </div>
             
             <div className="grid md:grid-cols-2 gap-8 my-10">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
                        <Calculator size={18} className="text-blue-500" /> Puntos a describir
                    </h4>
                    <ul className="text-sm space-y-2 list-disc pl-5">
                        <li>Identificar el coste unitario de cada ingrediente (Precio/kg o Precio/unidad).</li>
                        <li>Calcular el peso neto utilizado en la receta.</li>
                        <li>Determinar el <strong>Food Cost</strong> total del plato y por ración.</li>
                        <li>Establecer un <strong>margen bruto</strong> coherente (se recomienda un Food Cost de entre el 25% y 35%).</li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-slate-900 font-bold mb-3 flex items-center gap-2">
                        <Save size={18} className="text-green-500" /> Entregable
                    </h4>
                    <p className="text-sm">Hoja de escandallo profesional completada para cada uno de los platos de la carta, con el cálculo de mermas y raciones correctamente ejecutado.</p>
                </div>
             </div>
             
             <div className="flex justify-center">
                 <button onClick={() => setActiveTab('calculator')} className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-black">
                    Abrir Calculadora
                 </button>
             </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="flex-1 w-full">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Selecciona un plato para escandallar:</label>
                    <select 
                        className="w-full p-4 border-2 border-gray-100 rounded-xl text-lg font-bold bg-gray-50 focus:border-blue-500 focus:bg-white transition-all outline-none"
                        value={selectedDishId}
                        onChange={(e) => setSelectedDishId(e.target.value)}
                    >
                        <option value="">-- Elige un plato --</option>
                        {availableDishes.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.type})</option>
                        ))}
                    </select>
                </div>
                {currentDish && (
                   <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-md text-center">
                       <p className="text-[10px] font-bold uppercase opacity-80">Pax</p>
                       <p className="text-2xl font-black">{currentDish.servings}</p>
                   </div>
                )}
            </div>

            {currentDish ? (
                <div className="animate-fade-in pb-20">
                    {!canEdit && (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-orange-600" />
                            <p className="text-sm text-orange-800">
                                <strong>Modo Lectura:</strong> Solo el autor del plato ({state.team.find(m => m.id === currentDish.author)?.name}) o el Coordinador pueden editar este escandallo.
                            </p>
                        </div>
                    )}
                    {/* === PROFESIONAL ESCANDALLO SHEET === */}
                    <div className={`bg-white border-[3px] border-black shadow-2xl overflow-hidden max-w-5xl mx-auto ${!canEdit ? 'opacity-80' : ''}`}>
                        
                        {/* CABECERA */}
                        <div className="bg-[#bfdbfe] text-center py-6 border-b-[3px] border-black">
                            <h2 className="text-2xl font-black text-black tracking-widest uppercase">Hoja de Escandallo</h2>
                        </div>

                        {/* DATOS PLATO */}
                        <div className="flex border-b-[3px] border-black h-20">
                            <div className="flex-[2] border-r-[3px] border-black p-3 flex flex-col justify-between">
                                <span className="font-black text-[10px] uppercase text-gray-500">Denominación</span>
                                <input 
                                    className={`text-xl font-bold w-full bg-transparent focus:outline-none focus:text-blue-700 ${!canEdit ? 'cursor-not-allowed' : ''}`} 
                                    value={currentDish.name} 
                                    onChange={(e) => canEdit && setCurrentDish({...currentDish, name: e.target.value})}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="flex-1 border-r-[3px] border-black p-3 flex flex-col justify-between">
                                <span className="font-black text-[10px] uppercase text-gray-500">Nº Raciones</span>
                                <input 
                                    type="number"
                                    className={`text-xl font-bold w-full bg-transparent text-center focus:outline-none focus:text-blue-700 ${!canEdit ? 'cursor-not-allowed' : ''}`} 
                                    value={currentDish.servings} 
                                    onChange={(e) => canEdit && setCurrentDish({...currentDish, servings: parseInt(e.target.value) || 1})}
                                    disabled={!canEdit}
                                />
                            </div>
                            <div className="flex-1 p-3 flex flex-col justify-between bg-gray-50">
                                <span className="font-black text-[10px] uppercase text-gray-500">Fecha</span>
                                <span className="text-lg text-center font-bold">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* HEADERS TABLA */}
                        <div className="flex bg-[#bfdbfe] border-b-[3px] border-black text-center font-black text-black h-12 items-center text-xs uppercase tracking-tight">
                            <div className="flex-[2] border-r border-black h-full flex items-center justify-center">Productos</div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-center">Cantidad</div>
                            <div className="w-24 border-r border-black h-full flex items-center justify-center">Unidad</div>
                            <div className="flex-[1.5] flex flex-col h-full">
                                <div className="h-1/2 border-b border-black w-full flex items-center justify-center">Valoración Económica</div>
                                <div className="flex h-1/2">
                                    <div className="flex-1 border-r border-black flex items-center justify-center">Precio Unit. €</div>
                                    <div className="flex-1 flex items-center justify-center">Coste Total €</div>
                                </div>
                            </div>
                        </div>

                        {/* FILAS DE INGREDIENTES */}
                        <div className="text-sm">
                            {currentDish.ingredients.map((ing) => (
                                <div key={ing.id} className="flex border-b border-black h-10 items-center hover:bg-blue-50/20">
                                    {/* PRODUCTO */}
                                    <div className="flex-[2] border-r border-black h-full">
                                        <input 
                                            className={`w-full h-full px-3 bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-400 outline-none font-medium ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                            value={ing.name}
                                            onChange={(e) => canEdit && handleIngredientChange(ing.id, 'name', e.target.value)}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                    
                                    {/* CANTIDAD */}
                                    <div className="w-24 border-r border-black h-full">
                                        <input 
                                            type="number"
                                            className={`w-full h-full text-center bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-400 outline-none font-bold ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                            value={ing.quantity || ''}
                                            onChange={(e) => canEdit && handleIngredientChange(ing.id, 'quantity', parseFloat(e.target.value) || 0)}
                                            disabled={!canEdit}
                                        />
                                    </div>

                                    {/* UNIDAD */}
                                    <div className="w-24 border-r border-black h-full">
                                        <input 
                                            className={`w-full h-full text-center bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-400 outline-none uppercase text-[10px] font-black ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                            value={ing.unit}
                                            onChange={(e) => canEdit && handleIngredientChange(ing.id, 'unit', e.target.value)}
                                            placeholder="kg/g/l..."
                                            disabled={!canEdit}
                                        />
                                    </div>
                                    
                                    {/* PRECIO UNITARIO */}
                                    <div className="flex-[0.75] border-r border-black h-full">
                                        <input 
                                            type="number" 
                                            className={`w-full h-full text-center bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-400 outline-none font-bold text-blue-800 ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                            value={ing.unitPrice || ''}
                                            onChange={(e) => canEdit && handleIngredientChange(ing.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                            disabled={!canEdit}
                                        />
                                    </div>

                                    {/* COSTE DE LÍNEA */}
                                    <div className="flex-[0.75] h-full">
                                        <input 
                                            type="number"
                                            className={`w-full h-full text-right pr-4 bg-gray-50/50 focus:bg-white focus:ring-inset focus:ring-2 focus:ring-blue-400 outline-none font-mono font-bold ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                            value={ing.totalCost || ''}
                                            onChange={(e) => canEdit && handleIngredientChange(ing.id, 'totalCost', parseFloat(e.target.value) || 0)}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            {/* Filas vacías para estética profesional */}
                            {Array.from({ length: Math.max(0, 12 - currentDish.ingredients.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex border-b border-black h-10 bg-white">
                                    <div className="flex-[2] border-r border-black"></div>
                                    <div className="w-24 border-r border-black"></div>
                                    <div className="w-24 border-r border-black"></div>
                                    <div className="flex-[0.75] border-r border-black"></div>
                                    <div className="flex-[0.75]"></div>
                                </div>
                            ))}
                        </div>

                        {/* SECCIÓN DE TOTALES */}
                        <div className="bg-[#bfdbfe] border-t-2 border-black">
                            <div className="flex border-b border-black h-12 items-center">
                                <div className="flex-1 pl-4 font-black uppercase text-[11px] tracking-widest">Coste total materia prima</div>
                                <div className="w-44 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className={`w-full h-full text-right pr-10 bg-white focus:bg-yellow-50 font-black text-xl outline-none ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                        value={currentDish.financials.totalCost || ''}
                                        onChange={(e) => canEdit && handleFinancialInput('totalCost', parseFloat(e.target.value) || 0)}
                                        disabled={!canEdit}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-gray-400">€</span>
                                </div>
                            </div>
                            
                            <div className="flex border-b border-black h-12 items-center">
                                <div className="flex-1 pl-4 font-black uppercase text-[11px] tracking-widest">Coste por ración</div>
                                <div className="w-44 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className={`w-full h-full text-right pr-10 bg-white focus:bg-yellow-50 font-bold outline-none ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                        value={currentDish.financials.costPerServing || ''}
                                        onChange={(e) => canEdit && handleFinancialInput('costPerServing', parseFloat(e.target.value) || 0)}
                                        disabled={!canEdit}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-gray-400">€</span>
                                </div>
                            </div>

                            <div className="flex border-b border-black h-12 items-center">
                                <div className="flex-1 pl-4 font-black uppercase text-[11px] tracking-widest">% Food cost sugerido (30-35%)</div>
                                <div className="w-44 h-full border-l border-black relative">
                                    <input 
                                        type="number"
                                        className={`w-full h-full text-right pr-10 bg-white focus:bg-yellow-50 font-bold outline-none text-green-700 ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                        value={currentDish.financials.foodCostPercent || ''}
                                        onChange={(e) => canEdit && handleFinancialInput('foodCostPercent', parseFloat(e.target.value) || 0)}
                                        disabled={!canEdit}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-gray-400">%</span>
                                </div>
                            </div>

                            <div className="flex h-20 items-center bg-white border-t border-black">
                                <div className="flex-1 pl-4 font-black text-lg uppercase h-full flex items-center bg-gray-50 border-r border-black">
                                    Precio de venta (PVP)
                                </div>
                                <div className="w-44 h-full relative">
                                    <input 
                                        type="number"
                                        className={`w-full h-full text-right font-black text-3xl pr-12 bg-yellow-200 focus:bg-white outline-none transition-colors ${!canEdit ? 'cursor-not-allowed' : ''}`}
                                        value={currentDish.price || ''}
                                        onChange={(e) => canEdit && setCurrentDish({...currentDish, price: parseFloat(e.target.value) || 0})}
                                        disabled={!canEdit}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-2xl">€</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    {canEdit && (
                        <div className="flex justify-center mt-12 mb-20">
                             <button 
                                onClick={saveEscandallo}
                                className="bg-green-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-green-700 shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
                            >
                                <Save size={24} /> Guardar Escandallo Definitivo
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
                    <Calculator size={64} className="mx-auto text-gray-200 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-400 tracking-tight">Selecciona un plato para empezar</h3>
                    <p className="text-gray-400 mt-2">Usa el menú superior para cargar los datos de la ficha técnica.</p>
                </div>
            )}
        </div>
      )}
      <SaveButton />
    </div>
  );
};
