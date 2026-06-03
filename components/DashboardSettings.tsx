import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Upload, Save, Building2, Calendar } from 'lucide-react';
import { resizeImage } from '../lib/imageResizer';

export const DashboardSettings: React.FC = () => {
    const { state, updateSchoolSettings, updateImage } = useProject();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // We already update the state via onChange, so we just persist.
        // The persistence is handled via the debounced useEffect in ProjectContext
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const resized = await resizeImage(file, 400, 400);
                updateImage('schoolLogo', resized);
            } catch (err) {
                console.error("Error resizing image:", err);
            }
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-12">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-emerald-600" />
                Configuración del Proyecto
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del IES</label>
                  <input 
                      type="text" 
                      value={state.schoolName}
                      onChange={(e) => updateSchoolSettings(e.target.value, state.academicYear)}
                      className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Curso Académico</label>
                  <input 
                      type="text" 
                      value={state.academicYear}
                      onChange={(e) => updateSchoolSettings(state.schoolName, e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="flex items-end gap-2">
                    <button 
                        onClick={handleSave}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        {isSaving ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                    <label className="cursor-pointer bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all">
                        <Upload size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                </div>
            </div>
            {state.schoolLogo && (
                <div className="mt-4">
                    <p className="text-sm font-bold text-slate-400 mb-2">Logo actual:</p>
                    <img src={state.schoolLogo} alt="Logo" className="h-16 w-16 object-contain border rounded-lg" />
                </div>
            )}
        </div>
    );
};
