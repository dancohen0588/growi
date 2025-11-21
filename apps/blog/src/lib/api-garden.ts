// Garden API utilities for frontend
const API_BASE_URL = 'http://localhost:3000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('growi_access_token');
  console.log('[API_GARDEN] Getting auth headers - Token found:', !!token);
  if (token) {
    console.log('[API_GARDEN] Token (first 20 chars):', token.substring(0, 20) + '...');
  } else {
    console.warn('[API_GARDEN] No token found in localStorage');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Types
export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetailDto extends ProjectDto {
  gardens: any[];
  gardenCount: number;
  plantCount: number;
}

export interface PlantDto {
  id: string;
  gardenId: string;
  zoneId?: string;
  scientificName?: string;
  commonName: string;
  plantType: string;
  cycle?: string;
  plantedAt?: string;
  estimatedAgeMonths?: number;
  location?: any;
  exposure?: string;
  waterNeed?: string;
  wateringFrequencyDays?: number;
  wateringType?: string;
  substrate?: string;
  photosUrls: string[];
  isAlive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlantDetailDto extends PlantDto {
  garden?: { id: string; name: string };
  zone?: { id: string; name: string };
  activities: any[];
  reminders: any[];
}

export interface OverviewDto {
  projects: any[];
  totalPlants: number;
  plants: any[];
  upcomingReminders: any[];
  recentActivities: any[];
  weather?: any;
  activeAlerts: any[];
  hasGardenPlan: boolean;
}

// Helper function to unwrap API response
const unwrapResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  const result = await response.json();
  // API responses are wrapped in { data, timestamp, path } by TransformInterceptor
  return result.data || result;
};

// API Functions
export const gardenApi = {
  // Upload
  async uploadFile(file: File): Promise<{ url: string }> {
    const token = localStorage.getItem('growi_access_token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return unwrapResponse<{ url: string }>(response);
  },

  // Overview
  async getOverview(): Promise<OverviewDto> {
    console.log('[API_GARDEN] Calling getOverview()');
    const headers = getAuthHeaders();
    console.log('[API_GARDEN] Request headers:', headers);
    console.log('[API_GARDEN] Fetching:', `${API_BASE_URL}/me/overview`);
    
    const response = await fetch(`${API_BASE_URL}/me/overview`, {
      headers
    });
    
    console.log('[API_GARDEN] Response status:', response.status);
    console.log('[API_GARDEN] Response headers:', Object.fromEntries(response.headers.entries()));
    
    return unwrapResponse<OverviewDto>(response);
  },

  // Projects
  async getProjects(): Promise<ProjectDto[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders()
    });
    return unwrapResponse<ProjectDto[]>(response);
  },

  async getProject(id: string): Promise<ProjectDetailDto> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders()
    });
    return unwrapResponse<ProjectDetailDto>(response);
  },

  async createProject(data: { name: string; description?: string; coverImageUrl?: string }): Promise<ProjectDto> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return unwrapResponse<ProjectDto>(response);
  },

  async updateProject(id: string, data: Partial<ProjectDto>): Promise<ProjectDto> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return unwrapResponse<ProjectDto>(response);
  },

  async deleteProject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await unwrapResponse<void>(response);
  },

  // Plants
  async getPlantsByProject(projectId: string): Promise<PlantDto[]> {
    const response = await fetch(`${API_BASE_URL}/plants/by-project/${projectId}`, {
      headers: getAuthHeaders()
    });
    return unwrapResponse<PlantDto[]>(response);
  },

  async getPlantsByGarden(gardenId: string): Promise<PlantDto[]> {
    const response = await fetch(`${API_BASE_URL}/plants/by-garden/${gardenId}`, {
      headers: getAuthHeaders()
    });
    return unwrapResponse<PlantDto[]>(response);
  },

  async getPlant(id: string): Promise<PlantDetailDto> {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      headers: getAuthHeaders()
    });
    return unwrapResponse<PlantDetailDto>(response);
  },

  async createPlant(data: any): Promise<PlantDto> {
    const response = await fetch(`${API_BASE_URL}/plants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return unwrapResponse<PlantDto>(response);
  },

  async updatePlant(id: string, data: Partial<PlantDto>): Promise<PlantDto> {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return unwrapResponse<PlantDto>(response);
  },

  async deletePlant(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    await unwrapResponse<void>(response);
  }
};