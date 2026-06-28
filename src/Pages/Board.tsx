import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BoardService } from "../Services/BoardService";
import type { Board as BoardType } from "../types/board.types";
import { CircularProgress, Typography, Box, Alert } from "@mui/material";

export default function Board() {
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState<BoardType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {boardId = ""} = useParams();

  useEffect(() => {
    if (!boardId) {
      console.log("No boardId provided in query params.");
      return;
    }

    setLoading(true);
    setError(null);

    BoardService.getBoard(boardId)
      .then((res) => setBoard(res.data))
      .catch((ex) => {
        console.error(ex);
        setError("Couldn't load this board.");
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">{board?.title ?? "Board Page — Canvas coming soon"}</Typography>
      <Typography color="text.secondary">ID: {boardId}</Typography>
    </Box>
  );
}