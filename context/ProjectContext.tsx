
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ProjectState, Zone, Dish, TeamMember, MenuPrototype, Task6Roles, PeerReview, SeasonalProductContribution, ChecklistStatus } from '../types';
import { INITIAL_STATE, INITIAL_CHECKLIST } from '../constants';
import { 
  db, 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  OperationType,
  handleFirestoreError
} from '../firebase';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  state: ProjectState;
  loading: boolean;
  setCurrentUser: (id: string | null) => void;
  createProject: (name: string) => Promise<string>;
  joinProject: (code: string) => Promise<void>;
  claimTeamMember: (tempId: string) => Promise<void>;
  joinTeamAsNewMember: (name: string) => Promise<void>;
  updateSchoolSettings: (name: string, year: string) => void;
  updateImage: (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => void;
  updateTeamName: (name: string) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  selectZone: (zone: Zone) => void;
  updateZoneJustification: (text: string) => void;
  assignTask: (taskId: number, memberId: string | null) => void;
  updateTaskContent: (taskId: number, content: string) => void;
  updateConcept: (key: keyof ProjectState['concept'], value: any) => void;
  updateMission: (role: keyof ProjectState['missions'], data: any) => void;
  addDish: (dish: Dish) => void;
  removeDish: (id: string) => void;
  updateDish: (dish: Dish) => void;
  updateMenuPrototype: (data: Partial<MenuPrototype>) => void;
  updateTask6Roles: (roles: Partial<Task6Roles>) => void;
  updateSeasonalProducts: (data: Partial<SeasonalProductContribution>) => void;
  updateInterimReport: (data: any) => void;
  savePeerReview: (review: PeerReview) => void;
  updateChecklistItem: (id: string, status: ChecklistStatus) => void;
  toggleTeamLock: () => void;
  resetProject: () => void;
  persistChanges: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const sanitizeState = (loadedData: any): ProjectState => {
    if (!loadedData) return INITIAL_STATE;
    
    // Explicitly merge with initial state to ensure all fields are present
    // but allow loadedData to override them even if they are empty strings.
    const result: ProjectState = {
        ...INITIAL_STATE,
        ...loadedData,
        // Override fields that might be missing in loadedData with defaults if necessary
        schoolName: loadedData.schoolName !== undefined ? loadedData.schoolName : INITIAL_STATE.schoolName,
        academicYear: loadedData.academicYear !== undefined ? loadedData.academicYear : INITIAL_STATE.academicYear,
        
        // Sanitize team
        team: Array.isArray(loadedData.team) 
            ? loadedData.team.reduce((acc: TeamMember[], current: TeamMember) => {
                const isRealId = current.id.length >= 20;
                if (!isRealId) {
                    acc.push(current);
                } else {
                    const existing = acc.find(m => m.id === current.id);
                    if (!existing) acc.push(current);
                }
                return acc;
            }, [])
            : [],
        
        concept: { ...INITIAL_STATE.concept, ...(loadedData.concept || {}) },
        missions: { ...INITIAL_STATE.missions, ...(loadedData.missions || {}) },
        task2: { ...INITIAL_STATE.task2, ...(loadedData.task2 || {}) },
        task6: {
            designerIds: loadedData.task6?.designerIds || [],
            artisanIds: loadedData.task6?.artisanIds || [],
            editorIds: loadedData.task6?.editorIds || []
        },
        isTeamClosed: loadedData.isTeamClosed || false,
        menuPrototype: { ...INITIAL_STATE.menuPrototype, ...(loadedData.menuPrototype || {}) },
        dishes: Array.isArray(loadedData.dishes) ? loadedData.dishes : [],
        seasonalProducts: Array.isArray(loadedData.seasonalProducts) ? loadedData.seasonalProducts : [],
        coEvaluations: Array.isArray(loadedData.coEvaluations) ? loadedData.coEvaluations : [],
        
        interimReport: {
            ...INITIAL_STATE.interimReport,
            ...(loadedData.interimReport || {}),
            introduction: { ...INITIAL_STATE.interimReport.introduction, ...(loadedData.interimReport?.introduction || {}) },
            analysis: { 
                ...INITIAL_STATE.interimReport.analysis, 
                ...(loadedData.interimReport?.analysis || {}),
                companies: { ...INITIAL_STATE.interimReport.analysis.companies, ...(loadedData.interimReport?.analysis?.companies || {}) },
                products: { ...INITIAL_STATE.interimReport.analysis.products, ...(loadedData.interimReport?.analysis?.products || {}) },
                ods: { ...INITIAL_STATE.interimReport.analysis.ods, ...(loadedData.interimReport?.analysis?.ods || {}) },
                laborRisks: { ...INITIAL_STATE.interimReport.analysis.laborRisks, ...(loadedData.interimReport?.analysis?.laborRisks || {}) },
                conclusions: { ...INITIAL_STATE.interimReport.analysis.conclusions, ...(loadedData.interimReport?.analysis?.conclusions || {}) }
            },
            development: { ...INITIAL_STATE.interimReport.development, ...(loadedData.interimReport?.development || {}) }
        },
        checklist: Array.isArray(loadedData.checklist) ? loadedData.checklist : INITIAL_CHECKLIST,
    };
    
    return result;
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, user, adminEditMode, loading: authLoading } = useAuth();
  const [state, setState] = useState<ProjectState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);
  const syncLock = useRef(false);

  // Sync with Firestore
  useEffect(() => {
    if (authLoading) return;

    if (!profile?.projectId) {
      setState(INITIAL_STATE);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectRef = doc(db, 'projects', profile.projectId);
    
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        setState(prev => {
          const newState = sanitizeState(data);
          // Auto-detect identity if not set
          let nextCurrentUser = prev.currentUser;
          if (!nextCurrentUser && user?.uid) {
            const isMember = newState.team.some(m => m.id === user.uid);
            if (isMember) nextCurrentUser = user.uid;
          }
          
          return {
            ...newState,
            currentUser: nextCurrentUser
          };
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `projects/${profile.projectId}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.projectId, user?.uid, authLoading]);

  // Push local changes to Firestore (Debounced)
  // DEPRECATED: Replaced by granular updates in each handler function
  /*
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (syncLock.current) {
        syncLock.current = false;
        return;
    }

    if (!profile?.projectId) return;

    const timeoutId = setTimeout(async () => {
      try {
        const projectRef = doc(db, 'projects', profile.projectId!);
        // We only update the data fields, not the metadata
        const { id, code, createdBy, createdAt, ...dataToSync } = state;
        const cleanedData = Object.fromEntries(
            Object.entries(dataToSync).filter(([_, v]) => v !== undefined)
        );
        await updateDoc(projectRef, cleanedData as any);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `projects/${profile.projectId}`);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state, profile?.projectId]);
  */

  const createProject = async (name: string) => {
    if (!user) throw new Error("Debes iniciar sesión");
    
    const projectId = doc(collection(db, 'projects')).id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const creatorMember = {
      id: user.uid,
      name: profile?.displayName || user.displayName || 'Coordinador',
      role: 'Estudiante',
      isCoordinator: true
    };

    const newProject = {
      ...INITIAL_STATE,
      id: projectId,
      name,
      code,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      team: [creatorMember]
    };

    await setDoc(doc(db, 'projects', projectId), newProject).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `projects/${projectId}`);
      throw err;
    });
    await updateDoc(doc(db, 'users', user.uid), { projectId }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      throw err;
    });
    
    return code;
  };

  const joinProject = async (code: string) => {
    if (!user) throw new Error("Debes iniciar sesión");
    
    const q = query(collection(db, 'projects'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q).catch(err => {
      handleFirestoreError(err, OperationType.LIST, 'projects');
      throw err;
    });
    
    if (querySnapshot.empty) {
      throw new Error("Código de proyecto inválido");
    }

    const projectDoc = querySnapshot.docs[0];
    const projectId = projectDoc.id;
    
    // Solo actualizamos el perfil del usuario para vincularlo al proyecto
    // La identificación con un miembro del equipo se hará en el Dashboard
    await updateDoc(doc(db, 'users', user.uid), { projectId }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      throw err;
    });
  };

  const claimTeamMember = async (tempId: string) => {
    if (!user || !profile?.projectId) return;
    
    // Check if user is already in the team with their real UID
    const alreadyInTeam = state.team.find(m => m.id === user.uid);
    
    let team = [...state.team];
    
    if (alreadyInTeam) {
      // If user is already in team, we remove their old entry and replace the temp one,
      // OR we just remove the temp one and give them the assignments of that temp one.
      // Better: merge them.
      team = team.filter(m => m.id !== user.uid);
    }

    const index = team.findIndex(m => m.id === tempId);
    if (index === -1) return;

    const tempMember = team[index];
    team[index] = {
      ...tempMember,
      id: user.uid,
      // Keep coordinator status if either was coordinator
      isCoordinator: tempMember.isCoordinator || alreadyInTeam?.isCoordinator || false
    };

    // Actualizar todas las referencias al ID temporal en el estado del proyecto
    const updatedTask2 = {
      ...state.task2,
      tasks: state.task2.tasks.map(t => t.assignedToId === tempId ? { ...t, assignedToId: user.uid } : t)
    };
    
    const updatedDishes = state.dishes.map(d => d.author === tempId ? { ...d, author: user.uid } : d);
    
    const updatedTask6 = {
      ...state.task6,
      designerIds: state.task6.designerIds.map(id => id === tempId ? user.uid : id),
      artisanIds: state.task6.artisanIds.map(id => id === tempId ? user.uid : id),
      editorIds: state.task6.editorIds.map(id => id === tempId ? user.uid : id),
    };

    const updatedCoEvaluations = state.coEvaluations.map(r => ({
      ...r,
      evaluatorId: r.evaluatorId === tempId ? user.uid : r.evaluatorId,
      targetId: r.targetId === tempId ? user.uid : r.targetId,
    }));

    const updatedSeasonalProducts = state.seasonalProducts.map(p => p.memberId === tempId ? { ...p, memberId: user.uid } : p);
    
    const updatedChecklist = state.checklist.map(i => i.assignedToId === tempId ? { ...i, assignedToId: user.uid } : i);

    await updateDoc(doc(db, 'projects', profile.projectId), { 
      team,
      task2: updatedTask2,
      dishes: updatedDishes,
      task6: updatedTask6,
      coEvaluations: updatedCoEvaluations,
      seasonalProducts: updatedSeasonalProducts,
      checklist: updatedChecklist
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      throw err;
    });
    
    setState(prev => ({ 
      ...prev, 
      team, 
      task2: updatedTask2,
      dishes: updatedDishes,
      task6: updatedTask6,
      coEvaluations: updatedCoEvaluations,
      seasonalProducts: updatedSeasonalProducts,
      checklist: updatedChecklist,
      currentUser: user.uid 
    }));
  };

  const joinTeamAsNewMember = async (name: string) => {
    if (!user || !profile?.projectId) return;
    if (state.team.length >= 5) throw new Error("Equipo completo");

    const newMember: TeamMember = {
      id: user.uid,
      name: name,
      isCoordinator: state.team.length === 0
    };

    const newTeam = [...state.team, newMember];
    await updateDoc(doc(db, 'projects', profile.projectId), { team: newTeam }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      throw err;
    });
    setState(prev => ({ ...prev, team: newTeam, currentUser: user.uid }));
  };

  const setCurrentUser = (id: string | null) => setState(prev => ({ ...prev, currentUser: id }));

  const updateSchoolSettings = async (name: string, year: string) => {
    setState(prev => ({ ...prev, schoolName: name, academicYear: year }));
    if (profile?.projectId) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        schoolName: name,
        academicYear: year,
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateImage = async (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => {
    setState(prev => ({ ...prev, [type]: base64 }));
    if (profile?.projectId) {
        await updateDoc(doc(db, 'projects', profile.projectId), {
            [type]: base64,
        }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
        });
    }
  };
  const updateTeamName = async (name: string) => {
     setState(prev => ({ ...prev, teamName: name }));
     if (profile?.projectId) {
         await updateDoc(doc(db, 'projects', profile.projectId), {
             teamName: name,
         }).catch(err => {
             handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
         });
     }
  };
  const updateTeamMembers = async (members: TeamMember[]) => {
    const isCoordinator = state.team.find(m => m.id === state.currentUser)?.isCoordinator;
    const noMembers = state.team.length === 0;
    if (isCoordinator || noMembers || adminEditMode) {
      setState(prev => ({ ...prev, team: members }));
      if (profile?.projectId) {
          syncLock.current = true;
          await updateDoc(doc(db, 'projects', profile.projectId), { team: members }).catch(err => {
              handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
          });
      }
    } else {
      console.warn("Permission denied: Only coordinators can manage the team.");
    }
  };
  const selectZone = async (zone: Zone) => {
    setState(prev => ({ ...prev, selectedZone: zone }));
    if (profile?.projectId) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
          selectedZone: zone,
      }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateZoneJustification = async (text: string) => {
    setState(prev => ({ ...prev, zoneJustification: text }));
    if (profile?.projectId) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
          zoneJustification: text,
      }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const assignTask = async (taskId: number, memberId: string | null) => {
    const isCoordinator = state.team.find(m => m.id === state.currentUser)?.isCoordinator;
    if (isCoordinator || adminEditMode) {
      const updatedTasks = state.task2.tasks.map(t => t.id === taskId ? { ...t, assignedToId: memberId } : t);
      setState(prev => ({ ...prev, task2: { ...prev.task2, tasks: updatedTasks } }));
      if (profile?.projectId) {
        await updateDoc(doc(db, 'projects', profile.projectId), {
            task2: { ...state.task2, tasks: updatedTasks }
        }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
        });
      }
    } else {
      console.warn("Permission denied: Only coordinators can assign tasks.");
    }
  };
  const updateTaskContent = async (taskId: number, content: string) => {
    const isCoordinator = state.team.find(m => m.id === state.currentUser)?.isCoordinator;
    const task = state.task2.tasks.find(t => t.id === taskId);
    
    if (task && task.assignedToId !== state.currentUser && !isCoordinator && !adminEditMode) {
      console.warn("Permission denied: You can only edit your assigned tasks.");
      return;
    }

    const updatedTasks = state.task2.tasks.map(t => t.id === taskId ? { ...t, content: content } : t);
    
    setState(prev => ({ ...prev, task2: { ...prev.task2, tasks: updatedTasks } }));

    if (profile?.projectId) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
          task2: { ...state.task2, tasks: updatedTasks }
      }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateConcept = async (key: keyof ProjectState['concept'], value: any) => {
    // Concept can be edited by anyone in the team for now? 
    // The user requirement says: "si no tiene asignada esa tarea no podra editarla".
    // Concept definition might be a tasks assignment. Let's assume concept is not specifically assigned for now given the current context structure.
    // If it requires assignment, I would need a similar check here. 
    // Since concept is not a specific task in Task2, I might assume it is team-wide.
    // However, the user said "si no tiene asignada esa tarea no podra editarla".
    // Let's keep it allowing all if it's team-wide edit, unless the task assignment is elsewhere.
    
    // Actually, I'll allow team-wide for now as concept seems to be project-wide.
    // The user's request was about "reparto global de tareas". Tasks are Task2.
    
    // Update: If the user said ALL edits, I should apply this! concept is not a Task2 task.

    setState(prev => ({ ...prev, concept: { ...prev.concept, [key]: value } }));
    if (profile?.projectId) {
        await updateDoc(doc(db, 'projects', profile.projectId), {
            concept: { ...state.concept, [key]: value }
        }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
        });
    }
  };
  const updateMission = async (role: keyof ProjectState['missions'], data: any) => {
    setState(prev => ({ ...prev, missions: { ...prev.missions, [role]: { ...prev.missions[role], ...data } } }));
    if (profile?.projectId) {
        await updateDoc(doc(db, 'projects', profile.projectId), {
            missions: { ...state.missions, [role]: { ...state.missions[role], ...data } }
        }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
        });
    }
  };
  const addDish = async (dish: Dish) => {
    setState(prev => ({ ...prev, dishes: [...prev.dishes, { ...dish, author: dish.author || state.currentUser || '' }] }));
    if (profile?.projectId) {
      // Need updated state
      const newDishes = [...state.dishes, { ...dish, author: dish.author || state.currentUser || '' }];
      await updateDoc(doc(db, 'projects', profile.projectId), {
        dishes: newDishes
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const removeDish = async (id: string) => {
    let updatedDishes: Dish[] = [];
    setState(prev => {
      const dish = prev.dishes.find(d => d.id === id);
      const isCoordinator = prev.team.find(m => m.id === prev.currentUser)?.isCoordinator;
      if (dish && dish.author !== prev.currentUser && !isCoordinator && !adminEditMode) {
        console.warn("Permission denied: You can only remove your own dishes.");
        return prev;
      }
      updatedDishes = prev.dishes.filter(d => d.id !== id);
      return { ...prev, dishes: updatedDishes };
    });
    
    if (profile?.projectId && updatedDishes.length !== state.dishes.length) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        dishes: updatedDishes
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateDish = async (dish: Dish) => {
    let updatedDishes: Dish[] = [];
    setState(prev => {
      const existing = prev.dishes.find(d => d.id === dish.id);
      const isCoordinator = prev.team.find(m => m.id === prev.currentUser)?.isCoordinator;
      if (existing && existing.author !== prev.currentUser && !isCoordinator && !adminEditMode) {
        console.warn("Permission denied: You can only update your own dishes.");
        return prev;
      }
      updatedDishes = prev.dishes.map(d => d.id === dish.id ? dish : d);
      return { ...prev, dishes: updatedDishes };
    });
    
    if (profile?.projectId && updatedDishes.length > 0) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
          dishes: updatedDishes
      }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateMenuPrototype = async (data: Partial<MenuPrototype>) => {
    let newMenuPrototype: MenuPrototype | null = null;
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      const isCoordinator = currentUserMember?.isCoordinator || false;
      const isDesigner = prev.task6.designerIds.includes(prev.currentUser || '');
      const isArtisan = prev.task6.artisanIds.includes(prev.currentUser || '');
      const noRolesAssigned = prev.task6.designerIds.length === 0 && prev.task6.artisanIds.length === 0 && prev.task6.editorIds.length === 0;

      if (isCoordinator || noRolesAssigned || adminEditMode) {
        newMenuPrototype = { ...prev.menuPrototype, ...data };
        return { ...prev, menuPrototype: newMenuPrototype };
      }

      const keys = Object.keys(data);
      const canEditDigital = isDesigner && (keys.includes('digitalLink') || keys.includes('digitalDescription'));
      const canEditPhysical = isArtisan && (keys.includes('physicalPhoto') || keys.includes('physicalDescription'));
      
      if (canEditDigital || canEditPhysical) {
        newMenuPrototype = { ...prev.menuPrototype, ...data };
        return { ...prev, menuPrototype: newMenuPrototype };
      }

      return prev;
    });
    
    if (profile?.projectId && newMenuPrototype) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        menuPrototype: newMenuPrototype
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  const updateTask6Roles = async (roles: Partial<Task6Roles>) => {
    let newTask6: Task6Roles | null = null;
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      if (!currentUserMember?.isCoordinator && !adminEditMode) return prev;
      newTask6 = { ...prev.task6, ...roles };
      return { ...prev, task6: newTask6 };
    });
    
    if (profile?.projectId && newTask6) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        task6: newTask6
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };
  
  const updateInterimReport = async (data: any) => {
    let newInterimReport: any = null;
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      const isCoordinator = currentUserMember?.isCoordinator || false;
      const isEditor = prev.task6.editorIds.includes(prev.currentUser || '');
      const noRolesAssigned = prev.task6.designerIds.length === 0 && prev.task6.artisanIds.length === 0 && prev.task6.editorIds.length === 0;

      if (isCoordinator || isEditor || noRolesAssigned || adminEditMode) {
        newInterimReport = { ...prev.interimReport, ...data };
        return { ...prev, interimReport: newInterimReport };
      }
      return prev;
    });
    
    if (profile?.projectId && newInterimReport) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        interimReport: newInterimReport
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };

  const updateSeasonalProducts = async (data: Partial<SeasonalProductContribution>) => {
    if (!state.currentUser) return;
    let newSeasonalProducts: any = null;
    setState(prev => {
      const existing = prev.seasonalProducts.find(p => p.memberId === state.currentUser);
      if (existing) {
        newSeasonalProducts = prev.seasonalProducts.map(p => 
          p.memberId === state.currentUser ? { ...p, ...data } : p
        );
        return { ...prev, seasonalProducts: newSeasonalProducts };
      } else {
        newSeasonalProducts = [...prev.seasonalProducts, {
          memberId: state.currentUser!,
          productList: '',
          sustainability: '',
          impactAnalysis: '',
          sources: [],
          ...data
        }];
        return { ...prev, seasonalProducts: newSeasonalProducts };
      }
    });
    
    if (profile?.projectId && newSeasonalProducts) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        seasonalProducts: newSeasonalProducts
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };

  const savePeerReview = async (review: PeerReview) => {
    let newCoEvaluations: any = null;
    setState(prev => {
      if (review.evaluatorId !== prev.currentUser) return prev;
      newCoEvaluations = [...prev.coEvaluations.filter(r => !(r.evaluatorId === review.evaluatorId && r.targetId === review.targetId)), review];
      return { ...prev, coEvaluations: newCoEvaluations };
    });
    
    if (profile?.projectId && newCoEvaluations) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        coEvaluations: newCoEvaluations
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };

  const updateChecklistItem = async (id: string, status: ChecklistStatus) => {
    let newChecklist: any = null;
    setState(prev => {
      newChecklist = prev.checklist.map(item => 
        item.id === id ? { ...item, status } : item
      );
      return { ...prev, checklist: newChecklist };
    });
    
    if (profile?.projectId && newChecklist) {
      await updateDoc(doc(db, 'projects', profile.projectId), {
        checklist: newChecklist
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
      });
    }
  };

  const toggleTeamLock = async () => {
    let isClosed = false;
    setState(prev => {
      const isCoordinator = prev.team.find(m => m.id === prev.currentUser)?.isCoordinator;
      if (!isCoordinator && !adminEditMode) {
          alert("Solo el coordinador puede cerrar o abrir el equipo.");
          return prev;
      }
      isClosed = !prev.isTeamClosed;
      return { ...prev, isTeamClosed: isClosed };
    });
    
    if (profile?.projectId) {
        await updateDoc(doc(db, 'projects', profile.projectId), {
          isTeamClosed: isClosed
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `projects/${profile.projectId}`);
        });
    }
  };
  
  const resetProject = () => {
    setState(INITIAL_STATE);
  };

  const persistChanges = async () => {
    if (!profile?.projectId) return;
    try {
        const projectRef = doc(db, 'projects', profile.projectId);
        // We only update the data fields, not the metadata
        const { id, code, createdBy, createdAt, currentUser, ...dataToSync } = state;
        const cleanedData = Object.fromEntries(
            Object.entries(dataToSync).filter(([_, v]) => v !== undefined)
        );
        await updateDoc(projectRef, cleanedData as any);
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `projects/${profile.projectId}`);
        throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      state, loading, setCurrentUser, createProject, joinProject, claimTeamMember, joinTeamAsNewMember, updateSchoolSettings, updateImage,
      updateTeamName, updateTeamMembers, selectZone, updateZoneJustification, assignTask, updateTaskContent,
      updateConcept, updateMission, addDish, removeDish, updateDish, updateMenuPrototype, updateTask6Roles,
      updateSeasonalProducts, updateInterimReport, savePeerReview, updateChecklistItem, toggleTeamLock, resetProject, persistChanges 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
