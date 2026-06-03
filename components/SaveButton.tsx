import React, { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const SaveButton = () => {
  const { persistChanges } = useProject();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await persistChanges();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all ${
        saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {saving ? (
        <Loader2 className="animate-spin" size={20} />
      ) : saved ? (
        <Check size={20} />
      ) : (
        <Save size={20} />
      )}
      {saving ? "Guardando..." : saved ? "Guardado" : "Guardar Cambios"}
    </button>
  );
};
