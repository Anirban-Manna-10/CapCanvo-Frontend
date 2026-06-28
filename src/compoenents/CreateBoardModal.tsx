// src/components/CreateBoardModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { BoardService } from "../Services/BoardService";
import type { Board } from "../types/board.types";

const TITLE_MAX_LENGTH = 50;

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (board: Board) => void;
}

export default function CreateBoardModal({ open, onClose, onCreated }: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const trimmedLength = title.trim().length;
  const isTooLong = title.length > TITLE_MAX_LENGTH;
  const isEmpty = trimmedLength === 0;

  const handleClose = () => {
    if (submitting) return;
    setTitle("");
    setError(null);
    onClose();
  };

const handleSubmit = () => {
  if (isEmpty || isTooLong) return;

  setSubmitting(true);
  setError(null);

  BoardService.createBoard({ title: title.trim() })
    .then((res) => {
      if(res.data){
        onCreated(res.data);
        setTitle("");
        onClose();
      }else{
        setError("Couldn't create the board. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Failed to create board:", err);
      setError("Couldn't create the board. Please try again.");
    })
    .finally(() => {
      setSubmitting(false);
    });
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a new board</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={isTooLong || !!error}
          helperText={
            error
              ? error
              : isTooLong
              ? `Title must be ${TITLE_MAX_LENGTH} characters or fewer`
              : `${title.length}/${TITLE_MAX_LENGTH}`
          }
          disabled={submitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isEmpty && !isTooLong) handleSubmit();
          }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isEmpty || isTooLong || submitting}
        >
          {submitting ? "Creating..." : "Create board"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}