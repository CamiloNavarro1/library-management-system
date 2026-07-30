import { Box, Button, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

function EmptyState({
  title = "No hay registros",
  description = "Todavía no se ha registrado información.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <Box
      sx={{
        py: 7,
        px: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: 2,
          borderRadius: "50%",
          bgcolor: "action.hover",
          color: "text.secondary",
        }}
      >
        {icon || <InboxIcon sx={{ fontSize: 34 }} />}
      </Box>

      <Typography variant="h6">
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 460,
          mx: "auto",
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={{ mt: 3 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;