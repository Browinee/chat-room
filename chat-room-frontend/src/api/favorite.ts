import http from "./request";

export async function queryFavoriteList() {
  return http.get(`/favorite`);
}

export async function favoriteAdd(chatHistoryId: number) {
  return http.post(`/favorite`, {
    chatHistoryId,
  });
}

export async function favoriteDel(id: number) {
  return http.delete(`/favorite`, {
    params: {
      id,
    },
  });
}
