
export interface Zone {
  id: number;
  name: string;
  territory: string;
  concept: string;
  ingredients: string[];
}

export enum DishType {
  APPETIZER = 'Aperitivo/Snack',
  STARTER = 'Entrante',
  MAIN = 'Plato Principal',
  DESSERT = 'Postre'
}

export interface IngredientRow {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number; // Price per unit (e.g., €/kg)
  totalCost: number; // quantity * unitPrice
}

export interface DishFinancials {
  totalCost: number;
  costPerServing: number;
  foodCostPercent: number;
  grossMargin: number;
  grossMarginPercent: number;
  salePrice: number;
}

export interface Dish {
  id: string;
  name: string;
  type: DishType;
  servings: number; // Raciones
  photo: string | null; // Base64 image
  description: string; // Marketing description
  elaboration: string; // Technical instructions
  ingredients: IngredientRow[]; // Structured for Escandallo
  allergens: string[]; // List of Allergen IDs
  sustainabilityJustification: string;
  cost: number; // Estimated cost from Task 3 (kept for reference)
  price: number; // Target PVP
  financials: DishFinancials; // Detailed calculation from Task 5
  priceJustification: string; // Task 5 deliverable
  author: string; // ID of the TeamMember who created/owns this dish
}

export interface TeamMember {
  id: string;
  name: string;
  isCoordinator: boolean;
  presentationLink?: string;
  hasPhysicalMenu?: boolean;
}

export interface MicroTask {
  id: number;
  title: string;
  description: string;
  guidelines: string[]; // Specific instructions
  deliverable: string;  // Detailed deliverable description
  deliverableHint: string;
  assignedToId: string | null; // ID of TeamMember
  content: string; // The mini-report
}

export interface IndividualMission {
  explorer?: { mapUrl: string; menuAnalysis: string; gapAnalysis: string; };
  connector?: { targetAudience: string; surveyResults: string; idealCustomer: string; };
  guardian?: { ingredients: string; supplierInfo: string; coreIngredients: string; };
}

export interface MenuPrototype {
  generalStyle: string;
  digitalLink: string;
  physicalPhoto: string | null; // Base64
  physicalDescription: string;
}

export interface Task6Roles {
  designerIds: string[]; // Changed to array for multiple assignees
  artisanIds: string[];  // Changed to array
  editorIds: string[];   // Changed to array
}

// --- NEW CO-EVALUATION TYPES ---
export interface RubricItem {
  score: number; // 0.25 or -0.25
  justification: string;
}

export interface PeerReview {
  evaluatorId: string;
  targetId: string;
  timestamp: number;
  items: {
      participation: RubricItem;
      responsibility: RubricItem;
      collaboration: RubricItem;
      contribution: RubricItem;
  }
}

export interface SeasonalProductContribution {
  memberId: string;
  productList: string;
  sustainability: string;
  impactAnalysis: string;
  sources: string[];
}

export interface InterimReport {
  summary: string;
  introduction: {
    context: string;
    objectives: string;
    scope: string;
  };
  analysis: {
    companies: {
      identification: string;
      economicAnalysis: string;
      selectionJustification: string;
    };
    products: {
      identification: string;
      targetAudience: string;
      differentiation: string;
    };
    ods: {
      identification: string;
      justification: string;
    };
    laborRisks: {
      identification: string;
      measures: string;
    };
    conclusions: {
      synthesis: string;
      proposals: string;
    };
  };
  development: {
    planning: string;
    methodology: string;
    resources: string;
  };
  results: string;
  conclusions: string;
  recommendations: string;
  bibliography: string;
}

export type ChecklistStatus = 'not_started' | 'in_progress' | 'completed';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
  category: 'individual' | 'group' | 'admin';
  assignedToId?: string;
}

export interface ProjectState {
  // Firestore Metadata
  id?: string;
  code?: string;
  name?: string;
  createdBy?: string;
  createdAt?: string;

  // App Session State
  currentUser: string | null; // ID of the TeamMember currently using the app

  // School Identity
  schoolName: string;
  schoolLogo: string | null; // Base64 string
  academicYear: string;
  
  // Team Identity
  teamName: string;
  groupPhoto: string | null; // Base64 string
  
  selectedZone: Zone | null;
  zoneJustification: string;
  task2: {
    tasks: MicroTask[];
  };
  concept: {
    name: string;
    slogan: string;
    targetAudience: string;
    values: string[];
    restaurantLogo: string | null;
  };
  missions: IndividualMission;
  dishes: Dish[];
  menuPrototype: MenuPrototype;
  task6: Task6Roles;
  team: TeamMember[];
  isTeamClosed?: boolean;
  seasonalProducts: SeasonalProductContribution[];
  
  // --- NUEVA CONFIGURACIÓN ---
  coEvaluationPoints: number;

  // New: Store all reviews
  coEvaluations: PeerReview[];

  // Interim Report
  interimReport: InterimReport;

  // Progress Tracking
  checklist: ChecklistItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
