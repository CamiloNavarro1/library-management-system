import { Box, CircularProgress, Stack, Typography } from "@mui/material";

function LoadingState({ message = "Cargando información..." }) {
  return (
    <Box
      sx={{
        minHeight: 300,
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />

        <Typography color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}

export default LoadingState;