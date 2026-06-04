import React, { useEffect, useState } from 'react';
import { db, collection, query, where, onSnapshot, updateDoc, doc, getDocs, deleteDoc, handleFirestoreError, OperationType, logAction } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  FileText, 
  Search, 
  ShieldCheck,
  Clock,
  ExternalLink,
  Trash2,
  AlertCircle,
  UserCog,
  UserCheck,
  Ghost,
  ShieldAlert,
  LogOut,
  Info,
  Copy,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  UserCircle,
  Eye,
  History,
  UserMinus,
  Scale
} from 'lucide-react';
import { TeamMember, PeerReview } from '../types';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'student' | 'assistant';
  status: 'pending' | 'approved' | 'suspended';
  projectId?: string;
  impersonatingUid?: string | null;
}

interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  teamName: string;
  schoolName: string;
  createdAt: string;
  createdBy: string;
  team: TeamMember[];
  coEvaluations?: PeerReview[];
  coEvaluationPoints?: number;
}

interface AuditLog {
  id: string;
  action: string;
  details: any;
  userId: string;
  userEmail: string;
  timestamp: any;
}

export const AdminDashboard: React.FC = () => {
  const { profile, realProfile, impersonateUser, logout } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'audit' | 'evaluations'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = realProfile?.role === 'admin';
  const isAssistant = realProfile?.role === 'assistant';
  const canManageUsers = isSuperAdmin || isAssistant;

  const ROOT_ADMIN_EMAILS = ['juan.codina@murciaeduca.es', 'jcbbinger@gmail.com'];
  const isRootAdmin = (email: string) => ROOT_ADMIN_EMAILS.includes(email.toLowerCase().trim());

  useEffect(() => {
    if (realProfile?.role !== 'admin' && realProfile?.role !== 'assistant') return;

    // Listen to all users
    const qAllUsers = query(collection(db, 'users'));
    const unsubAllUsers = onSnapshot(qAllUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(d => d.data() as UserProfile));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    // Listen to pending users
    const qPending = query(collection(db, 'users'), where('status', '==', 'pending'));
    const unsubPending = onSnapshot(qPending, (snapshot) => {
      setPendingUsers(snapshot.docs.map(d => d.data() as UserProfile));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    });

    // Listen to all projects
    const qProjects = collection(db, 'projects');
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      setAllProjects(snapshot.docs.map(d => ({id: d.id, ...d.data()} as ProjectSummary)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
    });

    // Listen to audit logs
    const qAudit = query(collection(db, 'audit_logs'));
    const unsubAudit = onSnapshot(qAudit, (snapshot) => {
      const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
      setAuditLogs(logs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'audit_logs');
    });

    return () => {
      unsubAllUsers();
      unsubPending();
      unsubProjects();
      unsubAudit();
    };
  }, [realProfile]);

  const approveUser = async (uid: string) => {
    if (!canManageUsers) return;
    const targetUser = allUsers.find(u => u.uid === uid);
    if (targetUser && isRootAdmin(targetUser.email)) return;
    try {
      await updateDoc(doc(db, 'users', uid), { status: 'approved' });
      logAction('USER_APPROVED', { uid, email: targetUser?.email });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleRoleChange = async (uid: string, newRole: 'admin' | 'student' | 'assistant') => {
    if (!canManageUsers) return;
    
    // Only admins can promote to admin
    if (newRole === 'admin' && !isSuperAdmin) {
        alert("Solo los administradores pueden asignar el rol de ADMIN.");
        return;
    }

    const targetUser = allUsers.find(u => u.uid === uid);
    if (targetUser && isRootAdmin(targetUser.email)) return;
    
    try {
      const updates: any = { role: newRole };
      // Auto-approve if they were pending
      if (targetUser?.status === 'pending') {
          updates.status = 'approved';
      }
      
      await updateDoc(doc(db, 'users', uid), updates);
      logAction('ROLE_CHANGED', { uid, email: targetUser?.email, newRole, autoApproved: updates.status === 'approved' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const enterProjectAsMember = async (projectId: string, memberId: string) => {
    if (!realProfile?.uid) return;
    try {
      // Si el memberId es un UID real (largo), intentamos suplantar al usuario real
      const isRealUser = memberId.length >= 20;
      
      if (isRealUser) {
        await impersonateUser(memberId);
        logAction('ADMIN_IMPERSONATION_START', { targetUid: memberId, projectId });
      } else {
        // Si es un marcador de posición, entramos al proyecto y luego el admin 
        // tendrá que elegir esa identidad en el Dashboard
        await updateDoc(doc(db, 'users', realProfile.uid), { 
          projectId,
          impersonatingUid: null // Limpiamos suplantación previa si la había
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${realProfile.uid}`);
          throw err;
        });
        logAction('ADMIN_ENTER_PROJECT', { projectId, memberId });
      }
    } catch (error) {
      console.error("Error entering project as member:", error);
    }
  };

  const rejectUser = async (uid: string) => {
    if (!canManageUsers) return;
    const targetUser = allUsers.find(u => u.uid === uid);
    if (targetUser && isRootAdmin(targetUser.email)) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar permanentemente a este usuario?")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      logAction('USER_DELETED', { uid, email: targetUser?.email });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
    }
  };

  const suspendUser = async (uid: string, currentStatus: string) => {
    if (!canManageUsers) return;
    const targetUser = allUsers.find(u => u.uid === uid);
    if (targetUser && isRootAdmin(targetUser.email)) return;
    try {
      const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended';
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      logAction('USER_STATUS_CHANGE', { uid, email: targetUser?.email, newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!canManageUsers) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar este proyecto permanentemente? Todos los alumnos vinculados volverán a estar sin proyecto.")) return;
    
    try {
      // 1. Find all users in this project and reset them
      const usersInProject = allUsers.filter(u => u.projectId === projectId);
      const resetPromises = usersInProject.map(u => 
        updateDoc(doc(db, 'users', u.uid), { 
          projectId: null,
          status: 'approved' // Keep them approved but free
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${u.uid}`);
          throw err;
        })
      );
      
      await Promise.all(resetPromises);
      
      // 2. Delete the project document
      await deleteDoc(doc(db, 'projects', projectId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
        throw err;
      });
      logAction('PROJECT_DELETED', { projectId });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetUser = async (user: UserProfile) => {
    if (!canManageUsers) return;
    if (isRootAdmin(user.email)) return;
    if (!window.confirm(`¿Estás seguro de que quieres liberar a ${user.displayName} de su proyecto actual? Podrá crear o unirse a uno nuevo.`)) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { 
        projectId: null,
        status: 'approved' // Ensure they stay approved but free
      });
      logAction('USER_PROJECT_RESET', { uid: user.uid, email: user.email });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Detect duplicate accounts (same email, different UID)
  const duplicateEmails = allUsers.reduce((acc: {[email: string]: number}, user) => {
    const email = user.email.toLowerCase().trim();
    acc[email] = (acc[email] || 0) + 1;
    return acc;
  }, {});

  const filteredProjects = allProjects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Modo DIOS</h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Panel de Control</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Gestión de Usuarios</span>
            {pendingUsers.length > 0 && (
              <span className="ml-auto bg-white text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Todos los Proyectos</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'evaluations' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Scale className="w-5 h-5" />
            <span className="font-medium">Coevaluaciones</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Auditoría</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <img src={profile?.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-emerald-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{profile?.displayName}</p>
              <p className="text-xs text-slate-400 truncate">Administrador</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {activeTab === 'users' ? 'Gestión de Usuarios' : activeTab === 'projects' ? 'Explorador de Proyectos' : 'Registro de Auditoría'}
            </h2>
            <p className="text-slate-500">
              {activeTab === 'users' ? 'Aprueba o rechaza las solicitudes de acceso de los alumnos.' : 'Visualiza y supervisa el progreso de todos los equipos.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                // Simple feedback
                const btn = document.activeElement as HTMLButtonElement;
                const originalText = btn.innerHTML;
                btn.innerHTML = '¡Copiado!';
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
              }}
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              <Copy className="w-4 h-4" />
              Copiar Enlace de Registro
            </button>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </header>

        {activeTab === 'users' && (
          <>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">¿Cómo dar de alta a alumnos y profesores?</h4>
                <p className="text-xs text-blue-700 leading-relaxed mt-1">
                  Los usuarios deben iniciar sesión primero con su cuenta de Google. Una vez que lo hagan, aparecerán aquí como <strong>"Pendientes"</strong>. 
                  Usa el botón verde para aprobar su acceso y selecciona su rol (Alumno, Asistente o Admin).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No se encontraron usuarios.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.uid} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-slate-100" />
                    <div className="overflow-hidden flex-1">
                      <h3 className="font-bold text-slate-900 truncate">{user.displayName}</h3>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      {duplicateEmails[user.email.toLowerCase().trim()] > 1 && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                          <AlertCircle size={10} /> Cuenta Duplicada (Email repetido)
                        </p>
                      )}
                    </div>
                    {user.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : user.status === 'suspended' ? (
                      <PauseCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </div>

                    <div className="mb-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Rol del Usuario</label>
                      <div className="flex gap-1">
                        {(['student', 'assistant', 'admin'] as const).map((role) => {
                          const isRootUser = isRootAdmin(user.email);
                          return (
                            <button
                              key={role}
                              disabled={!canManageUsers || user.uid === realProfile?.uid || isRootUser}
                              onClick={() => handleRoleChange(user.uid, role)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                user.role === role 
                                  ? 'bg-slate-900 text-white shadow-sm' 
                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {role === 'admin' ? 'ADMIN' : role === 'assistant' ? 'ASISTENTE' : 'ALUMNO'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  
                  <div className="mt-auto flex gap-2">
                    {user.status === 'pending' ? (
                      <div className="flex-1 flex gap-2">
                        <button
                          onClick={() => approveUser(user.uid)}
                          disabled={!canManageUsers}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Activar Cuenta
                        </button>
                        <button
                          onClick={() => rejectUser(user.uid)}
                          disabled={!canManageUsers}
                          className="px-4 flex items-center justify-center bg-slate-100 text-slate-400 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          title="Rechazar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2 w-full">
                          {!isRootAdmin(user.email) && (
                            <button
                              onClick={() => impersonateUser(user.uid)}
                              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <Ghost className="w-4 h-4" />
                              Suplantar
                            </button>
                          )}
                          {canManageUsers && user.uid !== realProfile?.uid && !isRootAdmin(user.email) && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => suspendUser(user.uid, user.status)}
                                title={user.status === 'suspended' ? "Activar cuenta" : "Suspender cuenta"}
                                className={`w-10 flex items-center justify-center py-2 rounded-xl transition-all ${
                                  user.status === 'suspended' 
                                    ? 'bg-amber-100 text-amber-600 hover:bg-emerald-100 hover:text-emerald-600' 
                                    : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                                }`}
                              >
                                {user.status === 'suspended' ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => resetUser(user)}
                                title="Liberar para nuevo proyecto"
                                className="w-10 flex items-center justify-center bg-blue-50 text-blue-600 py-2 rounded-xl hover:bg-blue-100 transition-all"
                              >
                                <UserMinus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => rejectUser(user.uid)}
                                title="Eliminar permanentemente"
                                className="w-10 flex items-center justify-center bg-slate-50 text-slate-400 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        {user.status === 'suspended' && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                            <PauseCircle className="w-3 h-3" />
                            CUENTA SUSPENDIDA
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No se encontraron proyectos.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{project.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{project.schoolName || 'Sin centro educativo'}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <code className="text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg mb-2">
                          {project.code}
                        </code>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Equipo</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-wide">
                        {project.teamName || 'Equipo sin nombre'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                        <Clock size={14} />
                        Creado el {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex-1">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Users size={14} /> Miembros del Equipo ({project.team.length}/5)
                    </h4>
                    
                    <div className="grid gap-3">
                      {project.team.map((member) => {
                        const isReal = member.id.length >= 20;
                        return (
                          <button
                            key={member.id}
                            onClick={() => enterProjectAsMember(project.id, member.id)}
                            className="group flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${isReal ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                {member.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{member.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                  {isReal ? 'Usuario Vinculado' : 'Nombre Reservado'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <span className="text-[10px] font-black uppercase">Ver como él</span>
                              <Eye size={16} />
                            </div>
                          </button>
                        );
                      })}
                      {project.team.length === 0 && (
                        <p className="text-sm text-slate-400 italic text-center py-4">No hay miembros registrados aún.</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      ID: {project.id.substring(0, 8)}...
                    </div>
                    <button 
                      onClick={() => enterProjectAsMember(project.id, 'admin')}
                      className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <LayoutDashboard size={14} />
                      Entrar
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                    >
                      <Trash2 size={14} />
                      Eliminar Proyecto
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Coevaluaciones Diabólicas</h3>
                <p className="text-sm text-slate-500 font-medium">Revisión de las evaluaciones confidenciales entre alumnos.</p>
              </div>
              <Scale className="text-slate-300 w-8 h-8" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Puntos Max</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evaluador</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evaluado</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Puntuación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {allProjects.flatMap(project => (project.coEvaluations || []).map(evalu => ({...evalu, projectName: project.name, projectId: project.id, projectPoints: project.coEvaluationPoints || 1}))).map((evalu, idx) => {
                        const evaluator = allUsers.find(u => u.uid === evalu.evaluatorId)?.displayName || 'Desconocido';
                        const target = allUsers.find(u => u.uid === evalu.targetId)?.displayName || 'Desconocido';
                        const totalScore = (evalu.items.participation.score + evalu.items.responsibility.score + evalu.items.collaboration.score + evalu.items.contribution.score);
                        
                        return (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-4 text-sm font-bold text-slate-900">{evalu.projectName}</td>
                                <td className="px-8 py-4">
                                     <input 
                                        type="number" 
                                        defaultValue={evalu.projectPoints}
                                        onBlur={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val)) {
                                                updateDoc(doc(db, 'projects', evalu.projectId), { coEvaluationPoints: val });
                                            }
                                        }}
                                        className="w-16 border rounded-lg p-2 text-sm font-bold"
                                      />
                                </td>
                                <td className="px-8 py-4 text-sm text-slate-600">{evaluator}</td>
                                <td className="px-8 py-4 text-sm text-slate-600">{target}</td>
                                <td className="px-8 py-4">
                                     <span className={`font-black ${totalScore > 0 ? 'text-emerald-500' : totalScore < 0 ? 'text-red-500': 'text-slate-500'}`}>
                                        {totalScore > 0 ? '+' : ''}{totalScore.toFixed(2)}
                                     </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Registro de Auditoría</h3>
                <p className="text-sm text-slate-500 font-medium">Historial de acciones críticas realizadas en el sistema.</p>
              </div>
              <History className="text-slate-300 w-8 h-8" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha y Hora</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                        No hay registros de auditoría disponibles.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">
                              {log.timestamp?.toDate().toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {log.timestamp?.toDate().toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            log.action.includes('DELETE') || log.action.includes('REJECT') 
                              ? 'bg-red-50 text-red-600' 
                              : log.action.includes('APPROVE') 
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-blue-50 text-blue-600'
                          }`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{log.userEmail}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {log.userId.substring(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="max-w-xs overflow-hidden text-ellipsis">
                            <pre className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
