import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { obtenerUsuarios } from "../services/usuarioService";
import {
  obtenerEjemplaresDisponibles,
  obtenerLibros,
} from "../services/libroService";

const normalizarLista = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const formatearFechaInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const obtenerFechasIniciales = () => {
  const hoy = new Date();
  const devolucion = new Date(hoy);

  devolucion.setDate(devolucion.getDate() + 14);

  return {
    fechaPrestamo: formatearFechaInput(hoy),
    fechaDevolucion: formatearFechaInput(devolucion),
  };
};

function PrestamoFormDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}) {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [ejemplares, setEjemplares] = useState([]);

  const [usuarioId, setUsuarioId] = useState("");
  const [libroId, setLibroId] = useState("");
  const [ejemplarId, setEjemplarId] = useState("");

  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingCopies, setLoadingCopies] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});

  const libroSeleccionado = useMemo(
    () => libros.find((libro) => String(libro.id) === String(libroId)),
    [libros, libroId]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const fechasIniciales = obtenerFechasIniciales();

    setUsuarioId("");
    setLibroId("");
    setEjemplarId("");
    setEjemplares([]);

    setFechaPrestamo(fechasIniciales.fechaPrestamo);
    setFechaDevolucion(fechasIniciales.fechaDevolucion);

    setErrors({});
    setLoadError("");

    const cargarOpciones = async () => {
      setLoadingOptions(true);

      try {
        const [usuariosData, librosData] = await Promise.all([
          obtenerUsuarios(),
          obtenerLibros(),
        ]);

        setUsuarios(normalizarLista(usuariosData));
        setLibros(normalizarLista(librosData));
      } catch (error) {
        console.error(error);

        setLoadError(
          error.message ||
            "No fue posible cargar los usuarios y libros disponibles."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    cargarOpciones();
  }, [open]);

  useEffect(() => {
    if (!open || !libroSeleccionado?.isbn) {
      setEjemplares([]);
      setEjemplarId("");
      return;
    }

    const cargarEjemplares = async () => {
      setLoadingCopies(true);
      setEjemplarId("");
      setEjemplares([]);

      setErrors((previousErrors) => ({
        ...previousErrors,
        ejemplarId: "",
      }));

      try {
        const data = await obtenerEjemplaresDisponibles(
          libroSeleccionado.isbn
        );

        setEjemplares(normalizarLista(data));
      } catch (error) {
        console.error(error);

        setLoadError(
          error.message ||
            "No fue posible cargar los ejemplares disponibles."
        );
      } finally {
        setLoadingCopies(false);
      }
    };

    cargarEjemplares();
  }, [open, libroSeleccionado]);

  const handleFieldChange = (field, value) => {
    if (field === "usuarioId") setUsuarioId(value);
    if (field === "libroId") setLibroId(value);
    if (field === "ejemplarId") setEjemplarId(value);
    if (field === "fechaPrestamo") setFechaPrestamo(value);
    if (field === "fechaDevolucion") setFechaDevolucion(value);

    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!usuarioId) {
      newErrors.usuarioId = "Selecciona un usuario.";
    }

    if (!libroId) {
      newErrors.libroId = "Selecciona un libro.";
    }

    if (!ejemplarId) {
      newErrors.ejemplarId = "Selecciona un ejemplar disponible.";
    }

    if (!fechaPrestamo) {
      newErrors.fechaPrestamo =
        "La fecha del préstamo es obligatoria.";
    }

    if (!fechaDevolucion) {
      newErrors.fechaDevolucion =
        "La fecha de devolución es obligatoria.";
    }

    if (fechaPrestamo && fechaDevolucion) {
      const inicio = new Date(`${fechaPrestamo}T00:00:00`);
      const fin = new Date(`${fechaDevolucion}T00:00:00`);

      if (fin < inicio) {
        newErrors.fechaDevolucion =
          "La fecha de devolución no puede ser anterior al préstamo.";
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
      usuarioId: Number(usuarioId),
      ejemplarId: Number(ejemplarId),
      fechaPrestamo,
      fechaDevolucion,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Nuevo préstamo</DialogTitle>

      <DialogContent dividers>
        {loadingOptions ? (
          <Box
            sx={{
              minHeight: 260,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={34} />

              <Typography color="text.secondary">
                Cargando usuarios y libros...
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            {loadError && <Alert severity="error">{loadError}</Alert>}

            {usuarios.length === 0 && (
              <Alert severity="warning">
                No hay usuarios registrados. Debes crear un usuario antes de
                registrar un préstamo.
              </Alert>
            )}

            {libros.length === 0 && (
              <Alert severity="warning">
                No hay libros registrados en el catálogo.
              </Alert>
            )}

            <FormControl
              fullWidth
              error={Boolean(errors.usuarioId)}
              disabled={loading}
            >
              <InputLabel id="usuario-prestamo-label">
                Usuario
              </InputLabel>

              <Select
                labelId="usuario-prestamo-label"
                label="Usuario"
                value={usuarioId}
                onChange={(event) =>
                  handleFieldChange("usuarioId", event.target.value)
                }
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido} — {usuario.email}
                  </MenuItem>
                ))}
              </Select>

              {errors.usuarioId && (
                <FormHelperText>{errors.usuarioId}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(errors.libroId)}
              disabled={loading}
            >
              <InputLabel id="libro-prestamo-label">
                Libro
              </InputLabel>

              <Select
                labelId="libro-prestamo-label"
                label="Libro"
                value={libroId}
                onChange={(event) =>
                  handleFieldChange("libroId", event.target.value)
                }
              >
                {libros.map((libro) => (
                  <MenuItem key={libro.id} value={libro.id}>
                    {libro.titulo} — ISBN: {libro.isbn}
                  </MenuItem>
                ))}
              </Select>

              {errors.libroId && (
                <FormHelperText>{errors.libroId}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(errors.ejemplarId)}
              disabled={
                loading ||
                !libroId ||
                loadingCopies ||
                ejemplares.length === 0
              }
            >
              <InputLabel id="ejemplar-prestamo-label">
                Ejemplar disponible
              </InputLabel>

              <Select
                labelId="ejemplar-prestamo-label"
                label="Ejemplar disponible"
                value={ejemplarId}
                onChange={(event) =>
                  handleFieldChange("ejemplarId", event.target.value)
                }
              >
                {ejemplares.map((ejemplar) => (
                  <MenuItem key={ejemplar.id} value={ejemplar.id}>
                    {ejemplar.codigoInventario}
                  </MenuItem>
                ))}
              </Select>

              {loadingCopies && (
                <FormHelperText>
                  Consultando ejemplares disponibles...
                </FormHelperText>
              )}

              {!loadingCopies && libroId && ejemplares.length === 0 && (
                <FormHelperText>
                  Este libro no tiene ejemplares disponibles.
                </FormHelperText>
              )}

              {errors.ejemplarId && (
                <FormHelperText>{errors.ejemplarId}</FormHelperText>
              )}
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Fecha del préstamo"
                type="date"
                value={fechaPrestamo}
                onChange={(event) =>
                  handleFieldChange("fechaPrestamo", event.target.value)
                }
                error={Boolean(errors.fechaPrestamo)}
                helperText={errors.fechaPrestamo}
                disabled={loading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Fecha de devolución"
                type="date"
                value={fechaDevolucion}
                onChange={(event) =>
                  handleFieldChange("fechaDevolucion", event.target.value)
                }
                error={Boolean(errors.fechaDevolucion)}
                helperText={errors.fechaDevolucion}
                disabled={loading}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Stack>

            {libroSeleccionado && (
              <Alert severity="info">
                <Typography fontWeight={600}>
                  {libroSeleccionado.titulo}
                </Typography>

                <Typography variant="body2">
                  ISBN: {libroSeleccionado.isbn} · Ejemplares disponibles:{" "}
                  {ejemplares.length}
                </Typography>
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            loadingOptions ||
            usuarios.length === 0 ||
            libros.length === 0
          }
        >
          {loading ? "Registrando..." : "Registrar préstamo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PrestamoFormDialog;