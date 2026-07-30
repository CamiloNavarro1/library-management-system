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
  nombre: "",
  apellido: "",
  email: "",
  fechaNacimiento: "",
};

function UsuarioFormDialog({
  open,
  usuario,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const editando = Boolean(usuario?.id);

  useEffect(() => {
    if (open) {
      setForm({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        email: usuario?.email || "",
        fechaNacimiento: usuario?.fechaNacimiento || "",
      });

      setErrors({});
    }
  }, [open, usuario]);

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

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!form.fechaNacimiento) {
      newErrors.fechaNacimiento =
        "La fecha de nacimiento es obligatoria.";
    } else {
      const selectedDate = new Date(`${form.fechaNacimiento}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate >= today) {
        newErrors.fechaNacimiento =
          "La fecha de nacimiento debe ser anterior a hoy.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim().toLowerCase(),
      fechaNacimiento: form.fechaNacimiento,
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
        {editando ? "Editar usuario" : "Nuevo usuario"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              disabled={loading}
              autoFocus
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              error={Boolean(errors.apellido)}
              helperText={errors.apellido}
              disabled={loading}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={loading}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={handleChange}
              error={Boolean(errors.fechaNacimiento)}
              helperText={errors.fechaNacimiento}
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
        <Button
          onClick={onClose}
          disabled={loading}
        >
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
              : "Crear usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UsuarioFormDialog;