import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

const initialForm = {
  titulo: "",
  autor: "",
  isbn: "",
  edicion: "",
  fechaPublicacion: "",
};

function LibroFormDialog({
  open,
  libro,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const editando = Boolean(libro?.id);

  useEffect(() => {
    if (open) {
      setForm({
        titulo: libro?.titulo || "",
        autor: libro?.autor || "",
        isbn: libro?.isbn || "",
        edicion: libro?.edicion || "",
        fechaPublicacion: libro?.fechaPublicacion || "",
      });

      setErrors({});
    }
  }, [open, libro]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio.";
    }

    if (!form.autor.trim()) {
      newErrors.autor = "El autor es obligatorio.";
    }

    if (!form.isbn.trim()) {
      newErrors.isbn = "El ISBN es obligatorio.";
    }

    if (!form.edicion.trim()) {
      newErrors.edicion = "La edición es obligatoria.";
    }

    if (!form.fechaPublicacion) {
      newErrors.fechaPublicacion =
        "La fecha de publicación es obligatoria.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      isbn: form.isbn.trim(),
      edicion: form.edicion.trim(),
      fechaPublicacion: form.fechaPublicacion,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editando ? "Editar libro" : "Nuevo libro"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              error={Boolean(errors.titulo)}
              helperText={errors.titulo}
              disabled={loading}
              autoFocus
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Autor"
              name="autor"
              value={form.autor}
              onChange={handleChange}
              error={Boolean(errors.autor)}
              helperText={errors.autor}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="ISBN"
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              error={Boolean(errors.isbn)}
              helperText={errors.isbn}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Edición"
              name="edicion"
              value={form.edicion}
              onChange={handleChange}
              error={Boolean(errors.edicion)}
              helperText={errors.edicion}
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha de publicación"
              name="fechaPublicacion"
              type="date"
              value={form.fechaPublicacion}
              onChange={handleChange}
              error={Boolean(errors.fechaPublicacion)}
              helperText={errors.fechaPublicacion}
              disabled={loading}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
        </Grid>
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
          {loading
            ? "Guardando..."
            : editando
              ? "Guardar cambios"
              : "Crear libro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LibroFormDialog;