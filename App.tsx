
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Task1_TeamZone } from './pages/Task1_TeamZone';
import { ProjectSetup } from './pages/ProjectSetup';
import { Task2_Analysis } from './pages/Task2_Analysis';
import { ConceptDefinition } from './pages/ConceptDefinition';
import { MenuDesign } from './pages/MenuDesign';
import { Task4_MenuPrototype } from './pages/Task4_MenuPrototype';
import { Task5_Financials } from './pages/Task5_Financials';
import { Task6_FinalAssembly } from './pages/Task6_FinalAssembly';
import { TeamSync } from './pages/TeamSync';
import { FinalMemory } from './pages/FinalMemory';
import { InterimMemory } from './pages/InterimMemory';
import { AcademicGuide } from './pages/AcademicGuide';
import { CoEvaluation } from './pages/CoEvaluation';
import { TeacherEvaluation } from './pages/TeacherEvaluation';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { WaitingRoom } from './components/WaitingRoom';
import { SuspendedAccount } from './components/SuspendedAccount';
import { ProjectAccess } from './components/ProjectAccess';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TeamLockGuard } from './components/TeamLockGuard';
import { Loader2, Ghost } from 'lucide-react';

// Layout wrapper to conditionally show Sidebar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { profile, realProfile, impersonateUser } = useAuth();
  const isImpersonating = realProfile?.impersonatingUid != null;

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-blue-600 text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Ghost size={18} />
            </div>
            <p className="text-sm font-bold">
              MODO SUPLANTACIÓN: <span className="underline">{profile?.displayName}</span> ({profile?.email})
            </p>
          </div>
          <button 
            onClick={() => impersonateUser(null)}
            className="bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors"
          >
            Detener Suplantación
          </button>
        </div>
      )}
      {!isLanding && <Sidebar />}
      
      <main className={`flex-1 transition-all duration-300 ${!isLanding ? 'ml-64 print:ml-0 print:w-full' : ''} ${isImpersonating ? 'pt-12' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { loading: projectLoading } = useProject();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'assistant';

  return (
    <HashRouter>
      {!user ? (
        <Login />
      ) : isAdmin && !profile?.projectId ? (
        <AdminDashboard />
      ) : profile?.status === 'suspended' ? (
        <SuspendedAccount />
      ) : profile?.status === 'pending' && !isAdmin ? (
        <WaitingRoom />
      ) : !profile?.projectId ? (
        <ProjectAccess />
      ) : projectLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Sincronizando proyecto...</p>
          </div>
        </div>
      ) : (
        <AppLayout>
          <TeamLockGuard>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/academic-guide" element={<AcademicGuide />} />
              <Route path="/task-1" element={<Task1_TeamZone />} />
              <Route path="/setup" element={<ProjectSetup />} />
              <Route path="/sync" element={<TeamSync />} />
              <Route path="/task-2" element={<Task2_Analysis />} />
              <Route path="/zone" element={<Navigate to="/task-1" replace />} />
              <Route path="/concept" element={<ConceptDefinition />} />
              <Route path="/menu" element={<MenuDesign />} />
              <Route path="/task-4" element={<Task4_MenuPrototype />} />
              <Route path="/interim-memory" element={<InterimMemory />} />
              <Route path="/financials" element={<Task5_Financials />} />
              <Route path="/task-6" element={<Task6_FinalAssembly />} />
              <Route path="/co-eval" element={<CoEvaluation />} />
              <Route path="/teacher-eval" element={<TeacherEvaluation />} />
              <Route path="/memory" element={<FinalMemory />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </TeamLockGuard>
        </AppLayout>
      )}
    </HashRouter>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

