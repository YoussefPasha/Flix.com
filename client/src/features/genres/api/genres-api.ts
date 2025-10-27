import { api } from "@/lib/api-client";
import { fetchCached } from "@/lib/fetch-helpers";
import { Genre } from "@/types/api";
import { GenreFormData } from "../types";

export async function fetchGenres() {
  return fetchCached<Genre[]>("/v1/admin/genres", { revalidate: 3600 });
}

export async function fetchGenresClient() {
  return api.get<Genre[]>("/v1/admin/genres");
}

export async function fetchGenreTree() {
  return api.get<Genre[]>("/v1/admin/genres/tree");
}

export async function fetchGenre(id: string) {
  return api.get<Genre>(`/v1/admin/genres/${id}`);
}

export async function fetchGenreBySlug(slug: string) {
  return api.get<Genre>(`/v1/admin/genres/slug/${slug}`);
}

export async function createGenre(data: GenreFormData) {
  return api.post<Genre>("/v1/admin/genres", data);
}

export async function updateGenre(id: string, data: Partial<GenreFormData>) {
  return api.patch<Genre>(`/v1/admin/genres/${id}`, data);
}

export async function deleteGenre(id: string) {
  return api.delete<void>(`/v1/admin/genres/${id}`);
}
