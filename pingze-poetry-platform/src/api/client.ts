const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PoemType = '词' | '诗' | '曲' | '赋';

export interface User {
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  template_id: string;
  name: string;
  type: PoemType;
  dynasty?: string;
  line_count: number;
  character_count: number;
  pingze_pattern: Record<string, unknown>;
  rhyme_scheme: Record<string, unknown>;
  description?: string;
  example_poem?: string;
  created_at: string;
  updated_at: string;
}

export interface Poem {
  poem_id: string;
  user_id: string;
  title: string;
  content: string;
  poem_type: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  version: number;
  is_published: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
  template_name?: string;
}

export interface PoemVersion {
  version_id: string;
  poem_id: string;
  content: string;
  title?: string;
  version_number: number;
  change_summary?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreatePoemData {
  title: string;
  content: string;
  poem_type: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  is_published?: boolean;
}

export interface UpdatePoemData {
  title?: string;
  content?: string;
  poem_type?: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  is_published?: boolean;
}

export interface PoemListParams {
  page?: number;
  pageSize?: number;
  poem_type?: PoemType;
  is_published?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'like_count';
  sort_order?: 'ASC' | 'DESC';
}

export interface TemplateListParams {
  type?: PoemType;
  dynasty?: string;
  search?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data as ApiResponse<T>;
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async getPoems(params: PoemListParams = {}): Promise<ApiResponse<PaginatedResponse<Poem>>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params.poem_type) queryParams.set('poem_type', params.poem_type);
    if (params.is_published !== undefined) queryParams.set('is_published', params.is_published.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.sort_by) queryParams.set('sort_by', params.sort_by);
    if (params.sort_order) queryParams.set('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/poems?${queryString}` : '/poems';

    return this.request<PaginatedResponse<Poem>>(endpoint);
  }

  async getPoem(id: string): Promise<ApiResponse<Poem>> {
    return this.request<Poem>(`/poems/${id}`);
  }

  async createPoem(data: CreatePoemData): Promise<ApiResponse<Poem>> {
    return this.request<Poem>('/poems', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePoem(id: string, data: UpdatePoemData): Promise<ApiResponse<Poem>> {
    return this.request<Poem>(`/poems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePoem(id: string): Promise<ApiResponse> {
    return this.request(`/poems/${id}`, {
      method: 'DELETE',
    });
  }

  async getPoemVersions(poemId: string): Promise<ApiResponse<PoemVersion[]>> {
    return this.request<PoemVersion[]>(`/poems/${poemId}/versions`);
  }

  async createPoemVersion(poemId: string, changeSummary?: string): Promise<ApiResponse<PoemVersion>> {
    return this.request<PoemVersion>(`/poems/${poemId}/versions`, {
      method: 'POST',
      body: JSON.stringify({ change_summary: changeSummary }),
    });
  }

  async getTemplates(params: TemplateListParams = {}): Promise<ApiResponse<Template[]>> {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.set('type', params.type);
    if (params.dynasty) queryParams.set('dynasty', params.dynasty);
    if (params.search) queryParams.set('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/templates?${queryString}` : '/templates';

    return this.request<Template[]>(endpoint);
  }

  async getTemplate(id: string): Promise<ApiResponse<Template>> {
    return this.request<Template>(`/templates/${id}`);
  }

  async exportText(poemId: string): Promise<ApiResponse<{ poem_id: string; title: string; formatted_text: string }>> {
    return this.request<{ poem_id: string; title: string; formatted_text: string }>('/export/text', {
      method: 'POST',
      body: JSON.stringify({ poem_id: poemId }),
    });
  }

  async exportImage(poemId: string): Promise<ApiResponse<{ poem_id: string; title: string; html_content: string }>> {
    return this.request<{ poem_id: string; title: string; html_content: string }>('/export/image', {
      method: 'POST',
      body: JSON.stringify({ poem_id: poemId }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

export default api;
