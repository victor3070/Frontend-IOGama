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

export interface ConsolidatedResourceDto {
  index: number;
  name: string;
  unit: string;
  unitPrice: number;
}

export interface B3ReportDto {
  projectId: string;
  projectName: string;
  materials: ConsolidatedResourceDto[];
  labor: ConsolidatedResourceDto[];
  equipment: ConsolidatedResourceDto[];
}
