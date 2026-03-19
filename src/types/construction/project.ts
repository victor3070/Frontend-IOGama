export enum ProjectStatus {
  Draft = 0,
  Active = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4
}

export interface ProjectDto {
  id: string;
  name: string;
  code: string;
  location: string;
  client: string; // Cambiado de clientName a client
  exchangeRate: number;
  totalAmount: number; // Monto total calculado del presupuesto
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface CreateProjectRequest {
  name: string;
  code: string;
  location: string;
  client: string; // Cambiado de clientName a client
  exchangeRate: number;
}

export interface UpdateProjectRequest {
  name: string;
  code: string;
  location: string;
  client: string; // Cambiado de clientName a client
  exchangeRate: number;
  status: ProjectStatus;
}
