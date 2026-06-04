
import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Palette, Hammer, BookOpen, Lock, UserCheck, Eye, ExternalLink } from 'lucide-react';
import { SaveButton } from '../components/SaveButton';

export const Task6_FinalAssembly: React.FC = () => {
  const { state, updateTask6Roles, updateMemberPresentation } = useProject();
  const [activeTab, setActiveTab] = useState<'instructions' | 'roles' | 'supervision'>('instructions');

  // PERMISOS
  const currentUserMember = state.team.find(m => m.id === state.currentUser);
  const isCoordinator = currentUserMember?.isCoordinator || false;
  
  const coordinatorMember = state.team.find(m => m.isCoordinator);
  const teamMembers = state.team.filter(m => !m.isCoordinator);

  const toggleRole = (roleType: 'designerIds' | 'artisanIds' | 'editorIds', memberId: string) => {
      if (!isCoordinator) return;
      const currentIds = state.task6[roleType];
      let newIds: string[];
      if (currentIds.includes(memberId)) {
          newIds = currentIds.filter(id => id !== memberId);
      } else {
          newIds = [...currentIds, memberId];
      }
      updateTask6Roles({ [roleType]: newIds });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Tarea 8: Producción Final</h2>
            <p className="text-gray-600 mt-2">Fase 5 - Producción Final | Entrega: Marzo</p>
        </div>
        <div className="flex gap-2">
             <button 
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'instructions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Instrucciones
            </button>
            <button 
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'roles' ? 'bg-green-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                Misiones
            </button>
            <button 
                onClick={() => setActiveTab('supervision')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'supervision' ? 'bg-purple-600 text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
            >
                <Eye size={18} /> Supervisión
            </button>
        </div>
      </div>

      {activeTab === 'instructions' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Guía de la Tarea 8 (Modificada)</h3>
            <p>Es el momento de pulir el proyecto. Esta fase incluye la defensa individual.</p>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 text-lg mb-4">📢 Defensa Individual</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Cada miembro debe preparar su <strong>presentación individual</strong> sobre el proyecto grupal.</li>
                    <li>Sube el <strong>enlace</strong> a tu presentación personal aquí abajo.</li>
                    <li>Debes llevar la <strong>carta física</strong> (el prototipo de menú impreso) el día de la presentación.</li>
                </ul>
            </div>

            <div className="mt-8">
                <h4 className="font-bold text-gray-800 mb-4">Mis Entregas Individuales</h4>
                {currentUserMember && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enlace a tu presentación (Drive, Canva, Genially...)"
                            className="w-full border rounded p-2 text-sm"
                            value={currentUserMember.presentationLink || ''}
                            onChange={(e) => updateMemberPresentation(currentUserMember.id, e.target.value, currentUserMember.hasPhysicalMenu || false, currentUserMember.physicalMenuImage || null)}
                        />
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={!!currentUserMember.hasPhysicalMenu}
                                onChange={(e) => updateMemberPresentation(currentUserMember.id, currentUserMember.presentationLink || '', e.target.checked, currentUserMember.physicalMenuImage || null)}
                            />
                            Tengo lista la carta física para llevarla a la presentación.
                        </label>
                        <div className="mt-2 text-sm">
                            <label className="block text-gray-600 mb-1">Subir foto de la carta física:</label>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    updateMemberPresentation(currentUserMember.id, currentUserMember.presentationLink || '', !!currentUserMember.hasPhysicalMenu, reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }} />
                            {currentUserMember.physicalMenuImage && (
                                <img src={currentUserMember.physicalMenuImage} className="mt-2 w-32 h-32 object-cover rounded border" alt="Carta física" />
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8">
                 <button onClick={() => setActiveTab('roles')} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">
                    Ir al Reparto de Misiones
                 </button>
            </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-8">
             <div className="bg-white p-6 rounded-xl border border-gray-200 relative">
                {!isCoordinator && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                        <Lock size={14} /> Solo Coordinador
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-6">Asignación de Roles Finales</h3>
                <p className="text-gray-600 mb-6">
                    {isCoordinator ? 'Asigna los miembros (pueden ser varios por rol).' : 'Solo el Coordinador puede asignar estos roles.'}
                </p>

                {/* COORDINATOR ROLE CARD */}
                <div className="mb-8 border-b pb-8">
                    <div className="p-4 bg-indigo-50 rounded border border-indigo-200 flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 rounded-full text-indigo-700">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-900 text-lg">Dirección y Ensamblaje: {coordinatorMember?.name || 'Sin asignar'}</h4>
                            <p className="text-sm text-indigo-800 mt-1">
                                El Coordinador es responsable de ensamblar todas las partes, supervisar el trabajo de los especialistas y asegurar la entrega final. <strong>No participa en las subtareas específicas.</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Role A */}
                    <div className="p-4 bg-purple-50 rounded border border-purple-100">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-purple-900">Misión 8.A: Diseñadores</h4>
                        </div>
                        <div className="space-y-2">
                             {teamMembers.map(m => (
                                <label key={m.id} className={`flex items-center gap-2 text-sm p-1 rounded hover:bg-purple-100 ${isCoordinator ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={state.task6.designerIds.includes(m.id)}
                                        onChange={() => toggleRole('designerIds', m.id)}
                                        className="rounded text-purple-600 focus:ring-purple-500"
                                        disabled={!isCoordinator}
                                    />
                                    {m.name}
                                </label>
                            ))}
                            {teamMembers.length === 0 && <span className="text-xs text-gray-400 italic">No hay otros miembros.</span>}
                        </div>
                    </div>

                    {/* Role B */}
                    <div className="p-4 bg-orange-50 rounded border border-orange-100">
                         <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-orange-900">Misión 8.B: Artesanos</h4>
                        </div>
                        <div className="space-y-2">
                             {teamMembers.map(m => (
                                <label key={m.id} className={`flex items-center gap-2 text-sm p-1 rounded hover:bg-orange-100 ${isCoordinator ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={state.task6.artisanIds.includes(m.id)}
                                        onChange={() => toggleRole('artisanIds', m.id)}
                                        className="rounded text-orange-600 focus:ring-orange-500"
                                        disabled={!isCoordinator}
                                    />
                                    {m.name}
                                </label>
                            ))}
                            {teamMembers.length === 0 && <span className="text-xs text-gray-400 italic">No hay otros miembros.</span>}
                        </div>
                    </div>

                    {/* Role C */}
                    <div className="p-4 bg-blue-50 rounded border border-blue-100">
                         <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-blue-900">Misión 8.C: Editores</h4>
                        </div>
                        <div className="space-y-2">
                             {teamMembers.map(m => (
                                <label key={m.id} className={`flex items-center gap-2 text-sm p-1 rounded hover:bg-blue-100 ${isCoordinator ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={state.task6.editorIds.includes(m.id)}
                                        onChange={() => toggleRole('editorIds', m.id)}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                        disabled={!isCoordinator}
                                    />
                                    {m.name}
                                </label>
                            ))}
                            {teamMembers.length === 0 && <span className="text-xs text-gray-400 italic">No hay otros miembros.</span>}
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-500">
                 <p>Una vez asignados los roles, cada miembro debe trabajar en su área (actualizar prototipos en Tarea 4, etc.) y exportar su contribución en la página de <strong>Sincronización</strong>.</p>
             </div>
        </div>
      )}

      {activeTab === 'supervision' && (
          <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Supervisión de Entregables (Producción Final)</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      {/* DIGITAL REVIEW */}
                      <div>
                          <h4 className="font-bold text-purple-900 mb-2">Carta Digital (Canva)</h4>
                          <div className="bg-gray-50 p-4 rounded border border-gray-200">
                              {state.menuPrototype.digitalLink ? (
                                  <div>
                                      <p className="text-xs text-gray-500 mb-2">Enlace actual:</p>
                                      <a href={state.menuPrototype.digitalLink} target="_blank" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                                          <ExternalLink size={16} /> Abrir Diseño
                                      </a>
                                  </div>
                              ) : (
                                  <p className="text-red-500 italic text-sm">No se ha entregado el enlace.</p>
                              )}
                          </div>
                      </div>

                      {/* PHYSICAL REVIEW */}
                      <div>
                          <h4 className="font-bold text-orange-900 mb-2">Carta Física (Prototipo)</h4>
                          <div className="bg-gray-50 p-4 rounded border border-gray-200">
                              {state.menuPrototype.physicalPhoto ? (
                                  <div>
                                      <img src={state.menuPrototype.physicalPhoto} className="w-full h-48 object-cover rounded mb-2 border" />
                                      <p className="text-sm text-gray-700 italic">{state.menuPrototype.physicalDescription}</p>
                                  </div>
                              ) : (
                                  <p className="text-red-500 italic text-sm">No se ha subido la foto del prototipo.</p>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
      <SaveButton />
    </div>
  );
};
