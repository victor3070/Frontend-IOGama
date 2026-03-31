export interface B1ReportItemDto {
  id: string;
  itemNumber: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  unitPriceLiteral: string;
  totalPrice: number;
}

export interface B1ReportModuleDto {
  id: string;
  name: string;
  totalAmount: number;
  order: number;
  items: B1ReportItemDto[];
}

export interface B1ReportDto {
  projectId: string;
  projectName: string;
  projectCode: string;
  client: string;
  location: string;
  totalAmount: number;
  totalLiteral: string;
  modules: B1ReportModuleDto[];
}

// Formulario B-2 (Análisis de Precios Unitarios)
export interface AnalysisResourceItemDto {
  resourceId: string;
  name: string;
  unit: string;
  unitOfMeasureId: string;
  performance: number;
  unitPrice: number;
  total: number;
  type?: string;
}

export interface UnitPriceAnalysisDto {
  budgetItemId: string;
  itemName: string;
  itemUnit: string;
  itemQuantity: number;
  projectName: string;
  projectCode: string;
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
  taxITPercentage?: number;
  itPercentage?: number;
  taxIT: number;
  
  finalUnitPrice: number;
  finalUnitPriceLiteral: string;

  // Listas de recursos
  materials: AnalysisResourceItemDto[];
  labor: AnalysisResourceItemDto[];
  equipment: AnalysisResourceItemDto[];
}

// Formulario B-3 (Precios Unitarios Elementales)
export interface ConsolidatedResourceDto {
  index: number;
  name: string;
  unit: string;
  unitPrice: number;
}

export interface B3ReportDto {
  projectId: string;
  projectName: string;
  projectCode: string;
  client: string;
  location: string;
  categoryFilter?: string;
  materials: ConsolidatedResourceDto[];
  labor: ConsolidatedResourceDto[];
  equipment: ConsolidatedResourceDto[];
}
