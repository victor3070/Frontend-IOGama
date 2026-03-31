export interface BudgetItemDto {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  code: string;
  projectModuleId: string;
  total: number;
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
}

export interface CreateBudgetItemRequest {
  moduleId: string;
  name: string;
  unitOfMeasureId: string;
  quantity: number;
}

export interface UpdateBudgetItemRequest {
  id: string;
  name: string;
  unitOfMeasureId: string;
  quantity: number;
  code: string;
}

export interface ImportItemRequest {
  templateId: string;
  quantity: number;
}

export interface BulkImportRequest {
  moduleId: string;
  items: ImportItemRequest[];
}
