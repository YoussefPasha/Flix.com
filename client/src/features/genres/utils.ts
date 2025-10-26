import { Genre } from "./types";

export function buildGenreTree(genres: Genre[]): Genre[] {
  const map = new Map<string, Genre>();
  const roots: Genre[] = [];

  // First pass: create map
  genres.forEach((genre) => {
    map.set(genre.id, { ...genre, children: [] });
  });

  // Second pass: build tree
  genres.forEach((genre) => {
    const node = map.get(genre.id)!;
    if (genre.parentId) {
      const parent = map.get(genre.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function flattenGenreTree(genres: Genre[]): Genre[] {
  const result: Genre[] = [];

  function traverse(genre: Genre, level = 0) {
    result.push({ ...genre, name: "  ".repeat(level) + genre.name });
    if (genre.children) {
      genre.children.forEach((child) => traverse(child, level + 1));
    }
  }

  genres.forEach((genre) => traverse(genre));
  return result;
}
