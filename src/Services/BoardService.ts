// src/services/BoardService.ts
import { apiClient } from "../lib/apiClient";
import type { Board, CreateBoardRequest } from "../types/board.types";

const baseUrl = "/api/boards";

export const BoardService = {
  createBoard: (data: CreateBoardRequest) => apiClient.post<Board>(baseUrl, data),
  getMyBoards: () => apiClient.get<Board[]>(baseUrl),
};