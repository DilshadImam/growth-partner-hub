// API configuration and utilities
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with error handling
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('adminToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: { username: string; password: string }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('adminToken', data.token);
    }
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminAuth');
  }

  // Leads methods
  async getLeads(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leads?${queryString}`);
  }

  async getLead(id: string) {
    return this.request(`/leads/${id}`);
  }

  async updateLead(id: string, data: any) {
    return this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async getLeadStats(timeframe = '30d') {
    return this.request(`/leads/stats/overview?timeframe=${timeframe}`);
  }

  // Services methods
  async getServices() {
    return this.request('/services');
  }

  async createService(data: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Case studies methods
  async getCaseStudies() {
    return this.request('/case-studies');
  }

  async createCaseStudy(data: any) {
    return this.request('/case-studies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCaseStudy(id: string, data: any) {
    return this.request(`/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCaseStudy(id: string) {
    return this.request(`/case-studies/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for better TypeScript support
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: 'New' | 'Qualified' | 'Contacted' | 'Converted' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  score: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  features: string[];
  pricing?: {
    type: 'fixed' | 'hourly' | 'project';
    amount: number;
    currency: string;
  };
  isActive: boolean;
}

export interface CaseStudy {
  _id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  testimonial?: {
    content: string;
    author: string;
    position: string;
  };
  isPublished: boolean;
}