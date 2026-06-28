import { apiClient } from "../lib/apiClient";
import type { Board, CreateBoardRequest } from "../types/board.types";

const baseUrl = "/api/boards";

export const BoardService = {
  createBoard: (data: CreateBoardRequest) => apiClient.post<Board>(baseUrl, data),
  getBoard:(boardId: string) => apiClient.get(`${baseUrl}/${boardId}`),
  getBoards: () => apiClient.get<Board[]>(baseUrl),
};