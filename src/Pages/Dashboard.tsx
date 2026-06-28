import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Snackbar, Alert, Box, Typography, Button, Stack, Card, CardContent } from "@mui/material";
import { UserService } from "../Services/UserService";
import { BoardService } from "../Services/BoardService";
import type { Board } from "../types/board.types";
import CreateBoardModal from "../compoenents/CreateBoardModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    UserService.syncUser({
      email: user.emailAddresses[0]?.emailAddress ?? "",
      displayName: user.firstName ?? "",
      avatarUrl: user.imageUrl,
    })
      .then(() => setSynced(true))
      .catch((error) => {
        console.error("Error syncing user:", error);
        setSyncError("Failed to sync your account. Please refresh.");
      });
  }, [user]);

  useEffect(() => {
    if (!synced) return;

    BoardService.getBoards()
      .then((res) => setBoards(res.data))
      .catch((error) => console.error("Failed to load boards:", error));
  }, [synced]);

  const handleBoardCreated = (board: Board) => {
    setBoards((prev) => [board, ...prev]);
    navigate(`/board/${board?.id}`);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <UserButton />
      </Box>

      <Typography sx={{ px: 2 }}>Welcome, {user?.firstName}! 👋</Typography>

      <Box sx={{ px: 2, mt: 2 }}>
        <Stack direction="row" sx={{ mb: 2 }}>
          <Typography variant="h6">My Boards</Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            + Create board
          </Button>
        </Stack>

        <Stack spacing={1}>
          {boards.map((board) => (
            <Card key={board.id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">{board.title}</Typography>
              </CardContent>
            </Card>
          ))}
          {boards.length === 0 && (
            <Typography color="text.secondary">No boards yet — create your first one.</Typography>
          )}
        </Stack>
      </Box>

      <CreateBoardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleBoardCreated}
      />

      <Snackbar open={!!syncError} autoHideDuration={6000} onClose={() => setSyncError(null)}>
        <Alert severity="error" onClose={() => setSyncError(null)}>
          {syncError}
        </Alert>
      </Snackbar>
    </>
  );
}