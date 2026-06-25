// src/types/board.types.ts
export interface Board {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardRequest {
  title: string;
}