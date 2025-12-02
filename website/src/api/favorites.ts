export async function getFavorites() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) return [];
    throw new Error("Failed to load favorites");
  }

  return res.json();
}

export async function addFavorite(movieId: number | string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${movieId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add favorite");
  }

  return res.json();
}

export async function removeFavorite(movieId: number | string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${movieId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to remove favorite");
  }

  return res.json();
}

