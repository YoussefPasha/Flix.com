// Common API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Content Types
export enum ContentType {
  MOVIE = 'movie',
  SHOW = 'show',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface Content {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  type: ContentType;
  rating: string;
  ratingCount?: number;
  viewCount?: number;
  thumbnailUrl?: string;
  trailerUrl?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  genres?: Genre[];
  tags?: Tag[];
  castCrew?: CastCrew[];
  seasons?: Season[];
}

export interface Season {
  id: string;
  seasonNumber: number;
  contentId: string;
  releaseDate: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: number;
  seasonId: string;
  videoUrl?: string;
}

// Genre Types
export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Genre;
  children?: Genre[];
  createdAt: string;
  updatedAt: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Cast & Crew Types
export enum CastCrewRole {
  ACTOR = 'actor',
  DIRECTOR = 'director',
  PRODUCER = 'producer',
  WRITER = 'writer',
}

export interface CastCrew {
  id: string;
  name: string;
  role: CastCrewRole;
  bio?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Rating Types
export interface Rating {
  id: string;
  userId: string;
  contentId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface AggregateRating {
  averageRating: number;
  totalRatings: number;
}

// Review Types
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Review {
  id: string;
  userId: string;
  contentId: string;
  ratingId?: string;
  reviewText: string;
  likes: number;
  dislikes: number;
  isModerated: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  content?: Content;
}

// Query Parameters
export interface ContentQueryParams {
  page?: number;
  limit?: number;
  type?: ContentType;
  status?: ContentStatus;
  genreId?: string;
  tagId?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface SearchQueryParams {
  q?: string;
  type?: ContentType;
  genre?: string;
  year?: number;
  rating?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

