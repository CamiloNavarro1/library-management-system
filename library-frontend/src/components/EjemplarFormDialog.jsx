import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

function EjemplarFormDialog({
  open,
  libro,
  loading,
  onClose,
  onSubmit,
}) {
  const [codigoInventario, setCodigoInventario] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCodigoInventario("");
      setError("");
    }
  }, [open]);

  const handleSubmit = () => {
    const codigo = codigoInventario.trim();

    if (!codigo) {
      setError("El código de inventario es obligatorio.");
      return;
    }

    onSubmit({
      codigoInventario: codigo,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Agregar ejemplar</DialogTitle>

      <DialogContent dividers>
        {libro && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography fontWeight={600}>
              {libro.titulo}
            </Typography>

            <Typography variant="body2">
              ISBN: {libro.isbn}
            </Typography>
          </Alert>
        )}

        <TextField
          fullWidth
          label="Código de inventario"
          value={codigoInventario}
          onChange={(event) => {
            setCodigoInventario(event.target.value);
            setError("");
          }}
          error={Boolean(error)}
          helperText={error}
          disabled={loading}
          autoFocus
          placeholder="Ejemplo: LIB-001"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Agregando..." : "Agregar ejemplar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EjemplarFormDialog;