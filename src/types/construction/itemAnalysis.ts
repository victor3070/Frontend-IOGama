export interface AnalysisResourceDto {
  resourceId: string;
  name: string;
  unit: string;
  performance: number;
  unitPrice: number;
  total: number;
  type: string;
}

export interface BudgetItemAnalysisDto {
  budgetItemId: string;
  itemName: string;
  itemUnit: string;
  projectCode: string;
  projectName: string;
  client: string;
  location: string;
  
  // Totales y Subtotales
  totalMaterials: number;
  
  laborSubtotal: number;
  socialBenefitsPercentage: number;
  socialBenefits: number;
  laborIVAPercentage: number;
  laborIVA: number;
  totalLabor: number;
  
  equipmentSubtotal: number;
  minorToolsPercentage: number;
  minorTools: number;
  totalEquipment: number;
  
  generalExpensesPercentage: number;
  generalExpenses: number;
  utilityPercentage: number;
  utility: number;
  taxITPercentage: number;
  taxIT: number;
  
  finalUnitPrice: number;
  finalUnitPriceLiteral: string;

  // Listas de recursos
  materials: AnalysisResourceDto[];
  labor: AnalysisResourceDto[];
  equipment: AnalysisResourceDto[];
}

// DTO para POST /api/items/{id}/resources/custom
export interface AddCustomResourceRequest {
  budgetItemId: string;
  name: string;
  unitOfMeasureId: string;
  unitPrice: number;
  performance: number;
  quantity: number;
  type: string; // "Materiales", "Obreros", "Equipos"
}

// DTO para PUT /api/items/{id}/resources/{resourceId}
export interface UpdateItemResourceRequest {
  id: string; // resourceId
  name: string;
  unitOfMeasureId: string;
  unitPrice: number;
  performance: number;
  quantity: number;
  type: string;
}
