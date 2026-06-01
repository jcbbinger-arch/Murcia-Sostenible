import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Settings, Save, Download, AlertTriangle, UserCheck } from 'lucide-react';

export const ProjectSetup: React.FC = () => {
  const { 
    state, 
    assignTask, 
    updateTask6Roles
  } = useProject();

  const toggleRole = (roleType: 'designerIds' | 'artisanIds' | 'editorIds', memberId: string) => {
      const currentIds = state.task6[roleType];
      let newIds: string[];
      if (currentIds.includes(memberId)) {
          newIds = currentIds.filter(id => id !== memberId);
      } else {
          newIds = [...currentIds, memberId];
      }
      updateTask6Roles({ [roleType]: newIds });
  };

  const coordinator = state.team.find(m => m.isCoordinator);
  const teamMembers = state.team.filter(m => !m.isCoordinator);

  if(state.team.length === 0) {
      return (
          <div className="p-8 text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-gray-800">Equipo no definido</h2>
              <p className="text-gray-600 mb-4">Primero debes crear el equipo y definir sus miembros en la Tarea 1.</p>
          </div>
      )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-green-600"/> Configuración y Reparto Global
        </h2>
        <p className="text-gray-600 mt-2">
          <strong>Sincronización Automática:</strong> Los datos se guardan en tiempo real. 
          Comparte el <strong>Código del Proyecto</strong> con tus compañeros para que se unan al equipo.
        </p>
      </div>

      <div className="space-y-12">
          {/* SECTION 1: TASK 2 */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Reparto de Investigación (Tarea 2)</h3>
              <p className="text-sm text-gray-500 mb-4">Asigna las 10 micro-tareas de investigación equitativamente entre los miembros del equipo.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                  {state.task2.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                          <div className="text-sm">
                              <span className="font-bold text-gray-700">{task.id}. {task.title}</span>
                          </div>
                          <select 
                            className="text-sm border p-1 rounded w-40"
                            value={task.assignedToId || ''}
                            onChange={(e) => assignTask(task.id, e.target.value)}
                          >
                              <option value="">-- Asignar --</option>
                              {state.team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                      </div>
                  ))}
              </div>
          </section>

          {/* SECTION 2: DISHES - Removed as per request, replaced with info */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-green-900 mb-4">Carta y Fichas Técnicas (Tarea 3)</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-800">
                  <p><strong>Nota importante:</strong> Esta tarea <strong>NO se reparte</strong> aquí. Cada miembro del equipo debe crear sus <strong>4 fichas técnicas</strong> (Aperitivo, Entrante, Principal y Postre) individualmente en la sección "Carta".</p>
              </div>
          </section>

          {/* SECTION 3: ROLES TASK 6 */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-purple-900 mb-4">Roles de Producción (Tarea 7)</h3>
              
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 flex items-start gap-3">
                  <UserCheck className="text-indigo-600 mt-1" />
                  <div>
                      <h4 className="font-bold text-indigo-900">Rol del Coordinador: {coordinator?.name || 'No asignado'}</h4>
                      <p className="text-sm text-indigo-700">
                          El coordinador <strong>no participa</strong> en estos roles específicos, ya que su función es <strong>ensamblar todo el proyecto</strong>, supervisar la coherencia y gestionar la entrega final.
                      </p>
                  </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">Asigna las responsabilidades de producción final al resto del equipo. Puedes seleccionar a <strong>varias personas</strong> por rol.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                  {/* Designer */}
                  <div className="p-4 bg-purple-50 rounded border border-purple-200">
                      <h4 className="font-bold text-purple-900 text-sm mb-3">Diseñadores Gráficos (Digital)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {teamMembers.map(m => (
                            <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-purple-100 p-1 rounded">
                                <input 
                                    type="checkbox"
                                    checked={state.task6.designerIds.includes(m.id)}
                                    onChange={() => toggleRole('designerIds', m.id)}
                                    className="rounded text-purple-600 focus:ring-purple-500"
                                />
                                {m.name}
                            </label>
                        ))}
                        {teamMembers.length === 0 && <p className="text-xs text-gray-400">No hay miembros disponibles.</p>}
                      </div>
                  </div>

                  {/* Artisan */}
                  <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <h4 className="font-bold text-orange-900 text-sm mb-3">Artesanos (Físico)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {teamMembers.map(m => (
                            <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-orange-100 p-1 rounded">
                                <input 
                                    type="checkbox"
                                    checked={state.task6.artisanIds.includes(m.id)}
                                    onChange={() => toggleRole('artisanIds', m.id)}
                                    className="rounded text-orange-600 focus:ring-orange-500"
                                />
                                {m.name}
                            </label>
                        ))}
                         {teamMembers.length === 0 && <p className="text-xs text-gray-400">No hay miembros disponibles.</p>}
                      </div>
                  </div>

                  {/* Editor */}
                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                      <h4 className="font-bold text-blue-900 text-sm mb-3">Editores Jefes (Memoria)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {teamMembers.map(m => (
                            <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-blue-100 p-1 rounded">
                                <input 
                                    type="checkbox"
                                    checked={state.task6.editorIds.includes(m.id)}
                                    onChange={() => toggleRole('editorIds', m.id)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                {m.name}
                            </label>
                        ))}
                         {teamMembers.length === 0 && <p className="text-xs text-gray-400">No hay miembros disponibles.</p>}
                      </div>
                  </div>
              </div>
          </section>

          <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex justify-end items-center z-20">
              <div className="flex gap-4 items-center">
                  <div className="text-right mr-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Código para compartir</p>
                      <p className="text-xl font-mono font-black text-green-600">{state.code}</p>
                  </div>
                  <button 
                    onClick={() => {}}
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg transition-all active:scale-95"
                  >
                      <Save size={18} /> Guardar Configuración
                  </button>
              </div>
          </div>
          <div className="h-16"></div> {/* Spacer for fixed footer */}
      </div>
    </div>
  );
};