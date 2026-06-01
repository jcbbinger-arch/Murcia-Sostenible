import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Dish, DishType, IngredientRow, SeasonalProductContribution } from '../types';
import { ALLERGENS } from '../constants';
import { Plus, Trash2, Edit2, Image as ImageIcon, AlertCircle, BookOpen, PenTool, ClipboardList, Save, Leaf, Printer } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const MenuDesign: React.FC = () => {
  const { state, addDish, removeDish, updateDish, updateSeasonalProducts } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'seasonal' | 'design' | 'review' | 'deliverable'>('instructions');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number>(1);
  
  // Empty dish template
  const [newDish, setNewDish] = useState<Dish>({
    id: '',
    name: '',
    type: DishType.STARTER,
    servings: 1,
    photo: null,
    description: '',
    elaboration: '',
    ingredients: [],
    allergens: [],
    sustainabilityJustification: '',
    cost: 0,
    price: 0,
    financials: { totalCost: 0, costPerServing: 0, foodCostPercent: 0, grossMargin: 0, grossMarginPercent: 0, salePrice: 0 },
    priceJustification: '',
    author: ''
  });

  const handleSaveDish = () => {
    if (!newDish.name) return;
    if (newDish.ingredients.length === 0) return;
    
    // Ensure author is set correctly
    const dishToSave = { ...newDish, author: state.currentUser || '' };

    if (isEditing && isEditing !== 'NEW') {
      updateDish(dishToSave);
      setIsEditing(null);
    } else {
      addDish({ ...dishToSave, id: generateId() });
      setIsEditing(null);
    }
    
    // Reset form
    resetForm();
    // Return to list view
    setActiveTab('design');
  };

  const resetForm = () => {
    setNewDish({
        id: '',
        name: '',
        type: DishType.STARTER,
        servings: 1,
        photo: null,
        description: '',
        elaboration: '',
        ingredients: [],
        allergens: [],
        sustainabilityJustification: '',
        cost: 0,
        price: 0,
        financials: { totalCost: 0, costPerServing: 0, foodCostPercent: 0, grossMargin: 0, grossMarginPercent: 0, salePrice: 0 },
        priceJustification: '',
        author: ''
    });
    setActiveSection(1);
    setIsEditing(null);
  };

  const handleCreateNew = () => {
      resetForm();
      setIsEditing("NEW"); // Marker state to show form for new dish
  }

  const handleEditClick = (dish: Dish) => {
    let safeIngredients = dish.ingredients;
    if (typeof dish.ingredients === 'string') {
        safeIngredients = [];
    }

    setNewDish({
        ...dish,
        ingredients: safeIngredients,
        allergens: dish.allergens || [] 
    });
    setIsEditing(dish.id);
    setActiveSection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      removeDish(id);
      if (isEditing === id) {
          setIsEditing(null);
          resetForm();
      }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAllergen = (allergenId: string) => {
    setNewDish(prev => {
        const current = prev.allergens || [];
        if (current.includes(allergenId)) {
            return { ...prev, allergens: current.filter(id => id !== allergenId) };
        } else {
            return { ...prev, allergens: [...current, allergenId] };
        }
    });
  };

  const addIngredientRow = () => {
    setNewDish(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { id: generateId(), name: '', quantity: 0, unit: 'kg', unitPrice: 0, totalCost: 0 }]
    }));
  };

  const updateIngredientRow = (id: string, field: keyof IngredientRow, value: any) => {
    setNewDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing)
    }));
  };

  const removeIngredientRow = (id: string) => {
    setNewDish(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  // Filter dishes for current user
  const myDishes = state.dishes.filter(d => d.author === state.currentUser);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 3: Diseño de Carta</h2>
            <p className="text-gray-600 mt-2">Creación de Fichas Técnicas Profesionales.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <BookOpen size={18} /> Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('seasonal')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'seasonal' ? 'bg-amber-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <Leaf size={18} /> Productos Temporada
            </button>
            <button 
                onClick={() => { setActiveTab('design'); setIsEditing(null); }}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'design' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <PenTool size={18} /> Mis Platos
            </button>
             <button 
                onClick={() => setActiveTab('review')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'review' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <ClipboardList size={18} /> Ver Carta Completa
            </button>
            <button 
                onClick={() => setActiveTab('deliverable')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'deliverable' ? 'bg-slate-900 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <Printer size={18} /> Entregable Tarea 3
            </button>
        </div>
      </div>

      {/* TAB 1: INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Guía de Trabajo: Tarea 3</h3>
            
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
                <h4 className="font-bold text-blue-900 mt-0">Trabajo Individual</h4>
                <p className="text-sm">Cada miembro del equipo debe crear <strong>4 fichas técnicas</strong> completas.</p>
                <ul className="text-sm list-disc pl-5 mt-2">
                    <li>1 Aperitivo / Snack</li>
                    <li>1 Entrante</li>
                    <li>1 Plato Principal</li>
                    <li>1 Postre</li>
                </ul>
            </div>
            
            <p><strong>Nota sobre Costes:</strong> En esta ficha indicarás los ingredientes y cantidades. El cálculo económico real se hará automáticamente en la <strong>Tarea 5 (Escandallo)</strong>, y el precio final aparecerá aquí una vez calculado.</p>

            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500 mt-6">
                <h4 className="font-bold text-amber-900 mt-0">Novedad: Productos de Temporada</h4>
                <p className="text-sm">Antes de diseñar tus platos, debes completar la sección de <strong>Productos de Temporada</strong>. Esta investigación es fundamental para justificar la elección de tus ingredientes y la sostenibilidad de tu propuesta.</p>
            </div>

            <div className="mt-6 flex justify-center gap-4">
                 <button onClick={() => setActiveTab('seasonal')} className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-amber-700">
                    Completar Productos de Temporada
                 </button>
                 <button onClick={() => { setActiveTab('design'); setIsEditing(null); }} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-green-700">
                    Ir a Mis Platos
                 </button>
            </div>
        </div>
      )}

      {/* TAB: SEASONAL PRODUCTS */}
      {activeTab === 'seasonal' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Leaf className="text-amber-600" /> 1. Selección de Productos de Temporada
                </h3>
                <p className="text-gray-600 text-sm mt-1">Esta sección es básica para entender el porqué de los platos elaborados en la carta.</p>
            </div>

            {(() => {
                const myContribution = state.seasonalProducts.find(p => p.memberId === state.currentUser) || {
                    productList: '',
                    sustainability: '',
                    impactAnalysis: '',
                    sources: ['', '', '']
                };

                return (
                    <div className="space-y-6 max-w-4xl">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Lista de productos (ej. “Alcachofas, Murcia, km0”)</label>
                            <textarea 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 h-24"
                                placeholder="Escribe aquí los productos que has seleccionado..."
                                value={myContribution.productList}
                                onChange={(e) => updateSeasonalProducts({ productList: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Sostenibilidad (ej. “Reduce emisiones, ODS 12”)</label>
                            <input 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                placeholder="Justifica la sostenibilidad de estos productos..."
                                value={myContribution.sustainability}
                                onChange={(e) => updateSeasonalProducts({ sustainability: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Análisis de impacto (si es posible, ej. “Baja huella de carbono”)</label>
                            <input 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                placeholder="Describe el impacto ambiental positivo..."
                                value={myContribution.impactAnalysis}
                                onChange={(e) => updateSeasonalProducts({ impactAnalysis: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Fuentes (mínimo 3)</label>
                            <div className="space-y-2">
                                {[0, 1, 2].map(idx => (
                                    <input 
                                        key={idx}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                                        placeholder={`Fuente ${idx + 1}`}
                                        value={myContribution.sources[idx] || ''}
                                        onChange={(e) => {
                                            const newSources = [...(myContribution.sources || ['', '', ''])];
                                            newSources[idx] = e.target.value;
                                            updateSeasonalProducts({ sources: newSources });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                             <button 
                                onClick={() => setActiveTab('design')}
                                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-amber-700 flex items-center gap-2"
                             >
                                <Save size={18} /> Guardar e ir a Mis Platos
                             </button>
                        </div>
                    </div>
                );
            })()}
        </div>
      )}

      {/* TAB 2: DESIGN FORM & LIST */}
      {activeTab === 'design' && (
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LIST COLUMN (LEFT) */}
        <div className={`space-y-4 ${isEditing ? 'lg:col-span-4 hidden lg:block' : 'lg:col-span-12'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Mis Creaciones ({myDishes.length}/4)</h3>
                <button 
                    onClick={handleCreateNew}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={18} /> Nuevo Plato
                </button>
            </div>

            {myDishes.length === 0 && !isEditing && (
                <div className="bg-white p-12 text-center rounded-xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <PenTool size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">Aún no tienes platos</h3>
                    <p className="text-gray-500 mb-6">Comienza creando tu primer plato para la carta.</p>
                    <button onClick={handleCreateNew} className="text-blue-600 hover:underline font-bold">Crear Plato Ahora</button>
                </div>
            )}
            
            <div className={`grid gap-4 ${!isEditing ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {myDishes.map((dish) => (
                    <div 
                        key={dish.id} 
                        onClick={() => handleEditClick(dish)}
                        className={`group relative bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${isEditing === dish.id ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-300'}`}
                    >
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                {dish.photo ? (
                                    <img src={dish.photo} alt={dish.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={24}/></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase truncate">{dish.type}</span>
                                    <div className="flex gap-1">
                                        {dish.financials.salePrice > 0 && (
                                            <span className="text-xs font-bold text-gray-900 bg-yellow-100 px-1.5 py-0.5 rounded border border-yellow-200" title="Precio calculado en Escandallo">
                                                {dish.price}€
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm truncate leading-tight mb-1">{dish.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{dish.ingredients.length} ingredientes</p>
                            </div>
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                             <button 
                                onClick={(e) => handleDeleteClick(dish.id, e)} 
                                className="bg-white text-red-500 p-1.5 rounded-full shadow border hover:bg-red-50"
                                title="Eliminar"
                            >
                                <Trash2 size={14} />
                            </button>
                            <button className="bg-white text-blue-500 p-1.5 rounded-full shadow border hover:bg-blue-50">
                                <Edit2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* EDITOR COLUMN (RIGHT) */}
        {isEditing && (
        <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-fit animate-fade-in">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {isEditing === 'NEW' ? 'Nuevo Plato' : 'Editando Plato'}
                    </h3>
                    <p className="text-xs text-gray-500">{newDish.name || 'Sin nombre'}</p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(step => (
                        <div 
                            key={step} 
                            onClick={() => setActiveSection(step)}
                            className={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                                activeSection === step ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            Paso {step}
                        </div>
                    ))}
                    <button onClick={() => setIsEditing(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            
            <div className="p-6">
                {/* SECTION 1: IDENTITY */}
                {activeSection === 1 && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-green-700 border-b pb-2">1. Identidad y Presentación</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Nombre del Plato</label>
                                    <input 
                                        className="input-field w-full border p-2 rounded focus:ring-2 focus:ring-green-500"
                                        value={newDish.name}
                                        onChange={e => setNewDish({...newDish, name: e.target.value})}
                                        placeholder="Ej: Arroz con Conejo y Serranas"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Tipo</label>
                                        <select 
                                            className="w-full border p-2 rounded"
                                            value={newDish.type}
                                            onChange={e => setNewDish({...newDish, type: e.target.value as DishType})}
                                        >
                                            {Object.values(DishType).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Raciones</label>
                                        <input 
                                            type="number" 
                                            className="w-full border p-2 rounded"
                                            value={newDish.servings}
                                            onChange={e => setNewDish({...newDish, servings: parseInt(e.target.value) || 1})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Descripción Comercial</label>
                                    <textarea 
                                        className="w-full border p-2 rounded h-24 text-sm"
                                        value={newDish.description}
                                        onChange={e => setNewDish({...newDish, description: e.target.value})}
                                        placeholder="Descripción atractiva para el cliente que aparecerá en la carta..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 min-h-[250px]">
                                {newDish.photo ? (
                                    <div className="relative w-full h-full group">
                                        <img src={newDish.photo} alt="Plato" className="w-full h-56 object-cover rounded-lg shadow-sm" />
                                        <button 
                                            onClick={() => setNewDish({...newDish, photo: null})}
                                            className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-green-600 transition-colors w-full h-full justify-center">
                                        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                                            <ImageIcon size={32} />
                                        </div>
                                        <span className="text-sm font-bold">Subir Foto del Plato</span>
                                        <p className="text-xs text-gray-400 mt-1">Recomendado: Formato horizontal</p>
                                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={() => setActiveSection(2)} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Siguiente: Ingredientes</button>
                        </div>
                    </div>
                )}

                {/* SECTION 2: RECIPE */}
                {activeSection === 2 && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-green-700 border-b pb-2">2. Ficha Técnica e Ingredientes</h4>
                        
                        {/* Ingredients Table */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <label className="label mb-0">Listado de Ingredientes</label>
                                <button onClick={addIngredientRow} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center gap-1 font-bold shadow-sm">
                                    <Plus size={14} /> Añadir Fila
                                </button>
                            </div>
                            <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 text-left text-xs uppercase text-gray-500 font-bold">
                                        <tr>
                                            <th className="p-3 w-1/2">Ingrediente</th>
                                            <th className="p-3">Cantidad</th>
                                            <th className="p-3">Unidad</th>
                                            <th className="p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {newDish.ingredients.map((ing) => (
                                            <tr key={ing.id} className="hover:bg-gray-50">
                                                <td className="p-2">
                                                    <input 
                                                        className="w-full border p-1.5 rounded focus:ring-1 focus:ring-green-500 outline-none" 
                                                        placeholder="Ej: Tomate Pera"
                                                        value={ing.name}
                                                        onChange={(e) => updateIngredientRow(ing.id, 'name', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="number"
                                                        className="w-full border p-1.5 rounded focus:ring-1 focus:ring-green-500 outline-none" 
                                                        placeholder="0"
                                                        value={ing.quantity}
                                                        onChange={(e) => updateIngredientRow(ing.id, 'quantity', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <select 
                                                        className="w-full border p-1.5 rounded bg-white"
                                                        value={ing.unit}
                                                        onChange={(e) => updateIngredientRow(ing.id, 'unit', e.target.value)}
                                                    >
                                                        <option value="kg">kg</option>
                                                        <option value="g">g</option>
                                                        <option value="l">l</option>
                                                        <option value="ml">ml</option>
                                                        <option value="ud">ud</option>
                                                    </select>
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => removeIngredientRow(ing.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {newDish.ingredients.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-6 text-center text-gray-400 italic bg-gray-50">
                                                    Añade los ingredientes aquí. En la Tarea 5 usarás estos datos para calcular el coste.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Elaboration */}
                        <div>
                            <label className="label">Elaboración / Paso a Paso</label>
                            <textarea 
                                className="w-full border p-3 rounded h-32 text-sm focus:ring-2 focus:ring-green-500"
                                value={newDish.elaboration}
                                onChange={e => setNewDish({...newDish, elaboration: e.target.value})}
                                placeholder="1. Cortar las verduras...&#10;2. Sofreír a fuego lento..."
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setActiveSection(1)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Atrás</button>
                            <button onClick={() => setActiveSection(3)} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700">Siguiente: Seguridad</button>
                        </div>
                    </div>
                )}

                {/* SECTION 3: TECH & ALLERGENS */}
                {activeSection === 3 && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-green-700 border-b pb-2">3. Seguridad Alimentaria y Datos Económicos</h4>
                        
                        <div>
                            <label className="label mb-2 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" /> 
                                Alérgenos (Haz clic para marcar)
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {ALLERGENS.map(allergen => {
                                    const isActive = (newDish.allergens || []).includes(allergen.id);
                                    return (
                                        <button 
                                            key={allergen.id}
                                            onClick={() => toggleAllergen(allergen.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
                                                isActive 
                                                ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500 font-bold' 
                                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-xl mb-1">{allergen.icon}</span>
                                            <span className="text-[10px] text-center leading-tight">{allergen.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="label">Justificación Sostenible (Km0 / Temporada)</label>
                            <textarea 
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500 text-sm"
                                rows={2}
                                value={newDish.sustainabilityJustification}
                                onChange={e => setNewDish({...newDish, sustainabilityJustification: e.target.value})}
                                placeholder="¿Por qué este plato es sostenible? (Ej: Uso de tomates de Mazarrón en temporada...)"
                            />
                        </div>

                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex flex-col items-center text-center">
                            <p className="text-yellow-800 font-bold mb-2">💰 Estimación de Costes</p>
                            <p className="text-xs text-yellow-700 mb-4 max-w-md">
                                Estos valores se calculan automáticamente al realizar el Escandallo en la Tarea 5.
                                Puedes dejarlos a 0 ahora si aún no has hecho el cálculo.
                            </p>
                            
                            <div className="flex gap-8 w-full justify-center">
                                <div className="bg-white p-3 rounded border border-yellow-300 w-32">
                                    <label className="block text-[10px] uppercase font-bold text-gray-500">Coste MP</label>
                                    <div className="text-xl font-bold text-gray-800">
                                        {newDish.cost > 0 ? newDish.cost.toFixed(2) : '--'} €
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded border border-yellow-300 w-32">
                                    <label className="block text-[10px] uppercase font-bold text-gray-500">PVP Sugerido</label>
                                    <div className="text-xl font-bold text-green-600">
                                        {newDish.price > 0 ? newDish.price.toFixed(2) : '--'} €
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t mt-8">
                            <button onClick={() => setActiveSection(2)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Atrás</button>
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(null)} className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-600">Cancelar</button>
                                <button 
                                    onClick={handleSaveDish}
                                    className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"
                                >
                                    <Save size={18} /> Guardar Plato
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        )}
      </div>
      )}

      {/* TAB 3: REVIEW */}
      {activeTab === 'review' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Carta Completa del Restaurante</h3>
            <p className="text-gray-600 mb-8 text-center">
                Aquí puedes ver todos los platos creados por tus compañeros.
            </p>

            <div className="max-w-3xl mx-auto space-y-8 text-left">
                {Object.values(DishType).map(type => {
                    const dishesOfType = state.dishes.filter(d => d.type === type);
                    if (dishesOfType.length === 0) return null;
                    return (
                        <div key={type} className="border-b pb-6">
                            <h4 className="text-lg font-bold text-green-800 uppercase mb-4 tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {type}
                            </h4>
                            <div className="grid gap-3">
                                {dishesOfType.map(dish => {
                                    const authorName = state.team.find(m => m.id === dish.author)?.name || 'Desconocido';
                                    return (
                                        <div key={dish.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100 hover:border-gray-300 transition-colors">
                                            <div>
                                                <div className="font-bold text-gray-900">{dish.name}</div>
                                                <div className="text-xs text-gray-500">Autor: {authorName}</div>
                                            </div>
                                            <div className="text-right">
                                                 <span className="font-bold text-gray-700 block">{dish.price > 0 ? `${dish.price}€` : 'P.S.M.'}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                 {state.dishes.length === 0 && <p className="text-gray-400 italic text-center">No hay platos en la carta aún.</p>}
            </div>
        </div>
      )}

      {/* TAB: DELIVERABLE */}
      {activeTab === 'deliverable' && (
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 animate-fade-in">
            <div className="flex justify-between items-center mb-8 no-print">
                <h3 className="text-2xl font-bold text-slate-800">Vista Previa del Entregable Tarea 3</h3>
                <button 
                    onClick={() => window.print()}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg"
                >
                    <Printer size={18} /> Imprimir Tarea 3
                </button>
            </div>

            <div className="bg-white p-12 shadow-2xl rounded-lg max-w-4xl mx-auto print:shadow-none print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Tarea 3: Diseño de Carta</h1>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-sm">Proyecto: {state.concept.name || 'Sin Nombre'}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-400 uppercase">Alumno/a</div>
                        <div className="text-xl font-bold text-slate-900">{state.team.find(m => m.id === state.currentUser)?.name || 'Estudiante'}</div>
                    </div>
                </div>

                {/* Part 1: Seasonal Products (Group/Aggregated) */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                        <Leaf size={24} className="text-amber-600" /> Parte 1: Selección de Productos de Temporada (Grupal)
                    </h2>
                    <p className="text-sm text-slate-500 mb-6 italic">A continuación se muestra la recopilación de productos de temporada aportada por cada miembro del equipo.</p>
                    
                    <div className="space-y-6">
                        {state.team.map(member => {
                            const contribution = state.seasonalProducts.find(p => p.memberId === member.id);
                            if (!contribution) return null;
                            return (
                                <div key={member.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Aportación de: {member.name}</h4>
                                    </div>
                                    <div className="grid gap-4 text-sm">
                                        <div>
                                            <span className="font-bold text-slate-900 block mb-1">Lista de productos:</span>
                                            <p className="text-slate-700 whitespace-pre-wrap">{contribution.productList || '---'}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="font-bold text-slate-900 block mb-1">Sostenibilidad:</span>
                                                <p className="text-slate-700">{contribution.sustainability || '---'}</p>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900 block mb-1">Análisis de impacto:</span>
                                                <p className="text-slate-700">{contribution.impactAnalysis || '---'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900 block mb-1">Fuentes:</span>
                                            <ul className="list-decimal pl-5 text-slate-600">
                                                {contribution.sources.filter(s => s.trim()).map((s, i) => <li key={i}>{s}</li>)}
                                                {contribution.sources.filter(s => s.trim()).length === 0 && <li>No se han indicado fuentes.</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {state.seasonalProducts.length === 0 && (
                            <div className="text-center p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
                                No hay datos de productos de temporada registrados aún.
                            </div>
                        )}
                    </div>
                </div>

                {/* Part 2: Individual Dishes */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                        <PenTool size={24} className="text-green-600" /> Parte 2: Fichas Técnicas Individuales
                    </h2>
                    <p className="text-sm text-slate-500 mb-6 italic">Platos diseñados individualmente por el alumno/a para la carta del restaurante.</p>

                    <div className="space-y-12">
                        {myDishes.map((dish, idx) => (
                            <div key={dish.id} className="border-2 border-slate-900 rounded-xl overflow-hidden page-break-before">
                                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                                    <h3 className="text-xl font-bold uppercase tracking-tighter">{idx + 1}. {dish.name}</h3>
                                    <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase">{dish.type}</span>
                                </div>
                                
                                <div className="p-8 grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Descripción Comercial</h4>
                                            <p className="text-slate-700 italic leading-relaxed">"{dish.description || 'Sin descripción.'}"</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Ingredientes Principales</h4>
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700">
                                                {dish.ingredients.map(ing => (
                                                    <li key={ing.id} className="flex justify-between border-b border-slate-100 py-1">
                                                        <span>{ing.name}</span>
                                                        <span className="font-bold">{ing.quantity}{ing.unit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Alérgenos</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {dish.allergens.length > 0 ? dish.allergens.map(aId => {
                                                    const allergen = ALLERGENS.find(a => a.id === aId);
                                                    return (
                                                        <span key={aId} className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs flex items-center gap-1">
                                                            {allergen?.icon} {allergen?.name}
                                                        </span>
                                                    );
                                                }) : <span className="text-xs text-slate-400">Sin alérgenos declarados.</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {dish.photo && (
                                            <div className="border-4 border-slate-100 rounded-lg overflow-hidden shadow-sm">
                                                <img src={dish.photo} alt={dish.name} className="w-full h-48 object-cover" />
                                            </div>
                                        )}
                                        
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Elaboración Técnica</h4>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{dish.elaboration || 'No se ha detallado la elaboración.'}</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <h4 className="text-xs font-bold text-green-700 uppercase mb-2">Justificación Sostenible</h4>
                                            <p className="text-xs text-green-800 italic">{dish.sustainabilityJustification || 'No se ha detallado la justificación.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myDishes.length === 0 && (
                            <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
                                No has creado ningún plato para esta tarea aún.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-widest">
                    Documento generado por Murcia Sostenible Project Manager • {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
      )}

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem; }
      `}</style>
    </div>
  );
};