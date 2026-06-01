
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FileText, LayoutDashboard, DollarSign, Printer, Users, Microscope, UtensilsCrossed, Palette, Rocket, Settings, GraduationCap, Scale, Download, LogOut, Copy, Hash, ShieldCheck, ArrowLeft, Edit2, Lock, Unlock } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { db, doc, updateDoc } from '../firebase';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, colorClass, disabled }) => (
  <NavLink
    to={disabled ? '#' : to}
    onClick={(e) => disabled && e.preventDefault()}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
        disabled 
          ? 'opacity-40 cursor-not-allowed grayscale' 
          : isActive
            ? colorClass
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    {icon}
    <span className="flex-1">{label}</span>
    {disabled && <Lock size={12} className="text-gray-400" />}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const { state, resetProject, toggleTeamLock } = useProject();
  const { profile, realProfile, logout, impersonateUser, updateProfile, adminEditMode, setAdminEditMode } = useAuth();
  const isAdmin = realProfile?.role === 'admin';
  const isAssistant = realProfile?.role === 'assistant';
  const isActuallyAdmin = isAdmin || isAssistant;
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState('');

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    await updateProfile({ displayName: tempName });
    setIsEditingName(false);
  };

  const startEditing = () => {
    setTempName(profile?.displayName || '');
    setIsEditingName(true);
  };

  const exitProject = async () => {
    if (!realProfile?.uid) return;
    try {
      // Si estamos suplantando, detenemos la suplantación
      if (realProfile.impersonatingUid) {
        await impersonateUser(null);
      } else {
        // Si solo estamos viendo un proyecto con nuestro propio perfil
        await updateDoc(doc(db, 'users', realProfile.uid), { projectId: null });
        resetProject();
      }
    } catch (error) {
      console.error("Error exiting project:", error);
    }
  };

  const handleBackup = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = state.teamName ? state.teamName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'proyecto';
    const date = new Date().toISOString().slice(0, 10);
    
    link.href = url;
    link.download = `BACKUP_MURCIA_${safeName}_${date}.json`;
    link.click();
  };

  const copyCode = () => {
    if (state.code) {
      navigator.clipboard.writeText(state.code);
    }
  };

  const creationItems = [
    { to: "/task-1", icon: <Users size={18} />, label: "1. Equipo y Zona" },
    { to: "/setup", icon: <Settings size={18} />, label: "2. Reparto Global" },
  ];

  const executionItems = [
    { to: "/task-2", icon: <Microscope size={18} />, label: "3. Análisis" },
    { to: "/menu", icon: <UtensilsCrossed size={18} />, label: "4. Diseño de Carta" },
    { to: "/task-4", icon: <Palette size={18} />, label: "5. Prototipos" },
    { to: "/interim-memory", icon: <Printer size={18} />, label: "6. Memoria Intermedia" },
    { to: "/financials", icon: <DollarSign size={18} />, label: "7. Viabilidad" },
    { to: "/task-6", icon: <Rocket size={18} />, label: "8. Producción Final" },
    { to: "/co-eval", icon: <Scale size={18} />, label: "9. Coevaluación" },
    { to: "/memory", icon: <Printer size={18} />, label: "10. Memoria Final" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10 overflow-hidden no-print print:hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <Link to="/" className="text-xl font-bold text-green-800 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText className="text-green-600" size={24}/>
            Murcia Sostenible
        </Link>
        
        {profile && (
          <div className="mt-4 flex flex-col gap-2 p-2 bg-white rounded-xl border border-gray-100 shadow-sm relative group">
            {/* MASTER EDITION BADGE */}
            {isActuallyAdmin && adminEditMode && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border border-yellow-500 z-10 animate-pulse">
                MASTER EDIT ON
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full border border-green-200" />
              <div className="overflow-hidden flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full text-[11px] font-bold text-gray-900 border border-green-200 rounded px-1 outline-none focus:ring-1 focus:ring-green-500"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                    />
                    <button onClick={handleUpdateName} className="text-green-600 hover:text-green-700">
                      <ShieldCheck size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <p className="text-[11px] font-bold text-gray-900 truncate">{profile.displayName}</p>
                    <button 
                      onClick={startEditing}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-green-600"
                      title="Editar nombre"
                    >
                      <Edit2 size={10} />
                    </button>
                  </div>
                )}
                <p className="text-[9px] text-gray-500 truncate uppercase tracking-wider">{profile.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Admin/Assistant Back Button */}
        {isActuallyAdmin && (
            <div className="space-y-2 mb-4">
                <button 
                    onClick={exitProject}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Volver al Panel Admin
                </button>
                
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Modo Edición</span>
                        <button 
                            onClick={() => setAdminEditMode(!adminEditMode)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${adminEditMode ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        >
                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${adminEditMode ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <p className="text-[9px] text-emerald-600 font-medium leading-tight">
                        {adminEditMode ? 'Tienes superpoderes: puedes editar cualquier campo sin restricciones.' : 'Modo lectura activado para supervisión segura.'}
                    </p>
                </div>
            </div>
        )}

        {/* General */}
        <div>
            <NavItem 
                to="/dashboard" 
                icon={<LayoutDashboard size={18} />} 
                label="Panel Principal" 
                colorClass="bg-gray-100 text-gray-900 font-bold"
            />
             <NavItem 
                to="/academic-guide" 
                icon={<GraduationCap size={18} />} 
                label="Guía Académica" 
                colorClass="bg-yellow-50 text-yellow-800 border border-yellow-200"
            />
            {isActuallyAdmin && (
                <NavItem 
                    to="/teacher-eval" 
                    icon={<ShieldCheck size={18} className="text-emerald-600" />} 
                    label="Evaluación Docente" 
                    colorClass="bg-emerald-50 text-emerald-800 border border-emerald-200"
                />
            )}
        </div>

        {/* Phase 1: Creation (Blue) */}
        <div>
            <h4 className="text-[10px] uppercase font-bold text-blue-800 mb-2 px-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Fase 1: Configuración
            </h4>
            <div className="border-l-2 border-blue-100 pl-2 ml-1">
                {creationItems.map(item => (
                    <NavItem 
                        key={item.to} 
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        colorClass="bg-blue-50 text-blue-700 border border-blue-100"
                        disabled={item.to === '/setup' && !state.isTeamClosed && !isActuallyAdmin}
                    />
                ))}
            </div>
        </div>

        {/* Phase 2: Execution (Green) */}
        <div>
            <h4 className="text-[10px] uppercase font-bold text-green-800 mb-2 px-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Fase 2: Ejecución
            </h4>
            <div className="border-l-2 border-green-100 pl-2 ml-1">
                {executionItems.map(item => (
                    <NavItem 
                        key={item.to} 
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        colorClass="bg-green-50 text-green-700 border border-green-100"
                        disabled={!state.isTeamClosed && !isActuallyAdmin}
                    />
                ))}
            </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Proyecto</p>
              {state.code && (
                <button 
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded hover:bg-emerald-100 transition-colors"
                >
                  <Hash size={10} />
                  {state.code}
                  <Copy size={10} />
                </button>
              )}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                    <span>Equipo:</span>
                    <span className="font-bold truncate max-w-[80px] text-right">{state.teamName || '---'}</span>
                </div>
                <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className={`font-bold ${state.isTeamClosed ? 'text-red-600' : 'text-green-600'}`}>
                      {state.isTeamClosed ? 'Cerrado' : 'Abierto'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Carta:</span>
                    <span>{state.dishes.length}/4</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (state.dishes.length / 4) * 100)}%` }}
                    ></div>
                </div>
            </div>
            
            {/* Lock/Unlock Team Button (Only for Coordinator) */}
            {state.team.find(m => m.id === state.currentUser)?.isCoordinator && (
              <button 
                onClick={toggleTeamLock}
                className={`w-full mt-3 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                  state.isTeamClosed 
                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                    : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                }`}
              >
                {state.isTeamClosed ? (
                  <><Unlock size={12} /> Abrir Equipo</>
                ) : (
                  <><Lock size={12} /> Cerrar Equipo</>
                )}
              </button>
            )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button 
              onClick={handleBackup}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
              title="Descargar Copia JSON"
          >
              <Download size={12} /> Copia
          </button>
          <button 
              onClick={logout}
              className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors"
          >
              <LogOut size={12} /> Salir
          </button>
        </div>

        {/* AUTHOR BADGE */}
        <div className="pt-3 border-t border-gray-100 flex flex-col items-center">
            <div className="bg-[#0f172a] rounded-xl p-2.5 flex items-center gap-3 w-full shadow-md border border-gray-700">
                <div className="bg-white p-0.5 rounded-full w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="https://lh3.googleusercontent.com/d/1DkCOqFGdw3PZbyNUnTQNgeaAGjBfv1_e" alt="JCB Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-col flex overflow-hidden">
                    <span className="text-white font-bold text-xs leading-tight">Juan Codina</span>
                    <span className="text-gray-400 text-[9px] truncate">Original Design & Dev</span>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

