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

export interface UserWithPassword extends User {
  password_hash: string;
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

export interface PoemLike {
  like_id: string;
  poem_id: string;
  user_id: string;
  created_at: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
}

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

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PoemListFilters {
  poem_type?: PoemType;
  is_published?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'like_count';
  sort_order?: 'ASC' | 'DESC';
}

export interface TemplateListFilters {
  type?: PoemType;
  dynasty?: string;
  search?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePoemRequest {
  title: string;
  content: string;
  poem_type: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  is_published?: boolean;
}

export interface UpdatePoemRequest {
  title?: string;
  content?: string;
  poem_type?: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  is_published?: boolean;
}

export interface CreateVersionRequest {
  change_summary?: string;
}

export interface ExportTextRequest {
  poem_id: string;
}

export interface ExportImageRequest {
  poem_id: string;
}
