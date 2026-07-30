import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import PrestamoFormDialog from "../components/PrestamoFormDialog";

import {
  crearPrestamo,
  devolverPrestamo,
  eliminarPrestamo,
  obtenerPrestamos,
} from "../services/prestamoService";

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

const obtenerMensajeError = (
  error,
  mensajePredeterminado = "Ocurrió un error inesperado."
) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    mensajePredeterminado
  );
};

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "—";
  }

  const partes = String(fecha).split("-");

  if (partes.length === 3) {
    const [year, month, day] = partes;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  return date.toLocaleDateString("es-CO");
};

const obtenerConfiguracionEstado = (estado) => {
  const estadoNormalizado = String(estado || "").toUpperCase();

  const configuraciones = {
    PROGRAMADO: {
      label: "Programado",
      color: "info",
    },
    ACTIVO: {
      label: "Activo",
      color: "success",
    },
    PRESTADO: {
      label: "Activo",
      color: "success",
    },
    VENCIDO: {
      label: "Vencido",
      color: "error",
    },
    DEVUELTO: {
      label: "Devuelto",
      color: "default",
    },
    CANCELADO: {
      label: "Cancelado",
      color: "warning",
    },
  };

  return (
    configuraciones[estadoNormalizado] || {
      label: estado || "Sin estado",
      color: "default",
    }
  );
};

const puedeDevolverse = (prestamo) => {
  const estado = String(prestamo?.estadoPrestamo || "").toUpperCase();

  return !["DEVUELTO", "CANCELADO"].includes(estado);
};

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [returning, setReturning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);

  const [prestamoParaDevolver, setPrestamoParaDevolver] = useState(null);
  const [prestamoParaEliminar, setPrestamoParaEliminar] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const mostrarNotificacion = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const cerrarNotificacion = () => {
    setNotification((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const cargarPrestamos = useCallback(async () => {
    setLoading(true);

    try {
      const data = await obtenerPrestamos();
      setPrestamos(normalizarLista(data));
    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        obtenerMensajeError(
          error,
          "No fue posible cargar los préstamos."
        ),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  const prestamosFiltrados = useMemo(() => {
    const termino = search.trim().toLowerCase();

    if (!termino) {
      return prestamos;
    }

    return prestamos.filter((prestamo) => {
      const valores = [
        prestamo.id,
        prestamo.usuarioNombre,
        prestamo.tituloLibro,
        prestamo.isbn,
        prestamo.codigoInventario,
        prestamo.estadoPrestamo,
        prestamo.fechaPrestamo,
        prestamo.fechaDevolucion,
      ];

      return valores.some((valor) =>
        String(valor ?? "")
          .toLowerCase()
          .includes(termino)
      );
    });
  }, [prestamos, search]);

  const prestamosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage;
    const fin = inicio + rowsPerPage;

    return prestamosFiltrados.slice(inicio, fin);
  }, [prestamosFiltrados, page, rowsPerPage]);

  useEffect(() => {
    const ultimaPagina = Math.max(
      0,
      Math.ceil(prestamosFiltrados.length / rowsPerPage) - 1
    );

    if (page > ultimaPagina) {
      setPage(ultimaPagina);
    }
  }, [page, prestamosFiltrados.length, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleCrearPrestamo = async (prestamoData) => {
    setSaving(true);

    try {
      await crearPrestamo(prestamoData);

      setFormOpen(false);

      mostrarNotificacion(
        "El préstamo fue registrado correctamente.",
        "success"
      );

      await cargarPrestamos();
    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        obtenerMensajeError(
          error,
          "No fue posible registrar el préstamo."
        ),
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmarDevolucion = async () => {
    if (!prestamoParaDevolver?.id) {
      return;
    }

    setReturning(true);

    try {
      await devolverPrestamo(prestamoParaDevolver.id);

      setPrestamoParaDevolver(null);

      mostrarNotificacion(
        "La devolución fue registrada correctamente.",
        "success"
      );

      await cargarPrestamos();
    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        obtenerMensajeError(
          error,
          "No fue posible registrar la devolución."
        ),
        "error"
      );
    } finally {
      setReturning(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!prestamoParaEliminar?.id) {
      return;
    }

    setDeleting(true);

    try {
      await eliminarPrestamo(prestamoParaEliminar.id);

      setPrestamoParaEliminar(null);

      mostrarNotificacion(
        "El préstamo fue eliminado correctamente.",
        "success"
      );

      await cargarPrestamos();
    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        obtenerMensajeError(
          error,
          "No fue posible eliminar el préstamo."
        ),
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Préstamos
          </Typography>

          <Typography color="text.secondary">
            Administra los préstamos y devoluciones de ejemplares.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
        >
          Nuevo préstamo
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{
            p: 2.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <TextField
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar por usuario, libro, ISBN, ejemplar o estado..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: 430,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Tooltip title="Actualizar préstamos">
            <span>
              <IconButton
                onClick={cargarPrestamos}
                disabled={loading}
                aria-label="Actualizar préstamos"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {loading ? (
          <LoadingState message="Cargando préstamos..." />
        ) : prestamosFiltrados.length === 0 ? (
          <EmptyState
            title={
              search
                ? "No se encontraron préstamos"
                : "No hay préstamos registrados"
            }
            description={
              search
                ? "Prueba con otro término de búsqueda."
                : "Registra el primer préstamo de la biblioteca."
            }
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">
                        Usuario
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Libro
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Ejemplar
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Préstamo
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Devolución prevista
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Devolución real
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        Estado
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        Acciones
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {prestamosPaginados.map((prestamo) => {
                    const estado = obtenerConfiguracionEstado(
                      prestamo.estadoPrestamo
                    );

                    return (
                      <TableRow
                        key={prestamo.id}
                        hover
                        sx={{
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                        }}
                      >
                        <TableCell>
                          <Typography fontWeight={600}>
                            {prestamo.usuarioNombre || "Sin usuario"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ID: {prestamo.usuarioId ?? "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight={500}>
                            {prestamo.tituloLibro || "Sin título"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            ISBN: {prestamo.isbn || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>
                            {prestamo.codigoInventario || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {formatearFecha(prestamo.fechaPrestamo)}
                        </TableCell>

                        <TableCell>
                          {formatearFecha(prestamo.fechaDevolucion)}
                        </TableCell>

                        <TableCell>
                          {formatearFecha(
                            prestamo.fechaDevolucionReal
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={estado.label}
                            color={estado.color}
                            size="small"
                            variant={
                              estado.color === "default"
                                ? "outlined"
                                : "filled"
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <Tooltip
                              title={
                                puedeDevolverse(prestamo)
                                  ? "Registrar devolución"
                                  : "El préstamo ya fue devuelto"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  disabled={!puedeDevolverse(prestamo)}
                                  onClick={() =>
                                    setPrestamoParaDevolver(prestamo)
                                  }
                                  aria-label="Registrar devolución"
                                >
                                  <AssignmentReturnIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Eliminar préstamo">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  setPrestamoParaEliminar(prestamo)
                                }
                                aria-label="Eliminar préstamo"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={prestamosFiltrados.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} de ${count}`
              }
            />
          </>
        )}
      </Paper>

      <PrestamoFormDialog
        open={formOpen}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setFormOpen(false);
          }
        }}
        onSubmit={handleCrearPrestamo}
      />

      <ConfirmDialog
        open={Boolean(prestamoParaDevolver)}
        title="Registrar devolución"
        message={
          prestamoParaDevolver
            ? `¿Confirmas la devolución del ejemplar ${
                prestamoParaDevolver.codigoInventario || ""
              } del libro "${
                prestamoParaDevolver.tituloLibro || ""
              }"?`
            : ""
        }
        confirmText="Registrar devolución"
        loading={returning}
        onClose={() => {
          if (!returning) {
            setPrestamoParaDevolver(null);
          }
        }}
        onConfirm={confirmarDevolucion}
      />

      <ConfirmDialog
        open={Boolean(prestamoParaEliminar)}
        title="Eliminar préstamo"
        message={
          prestamoParaEliminar
            ? `¿Estás seguro de eliminar el préstamo del libro "${
                prestamoParaEliminar.tituloLibro || ""
              }"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        confirmColor="error"
        loading={deleting}
        onClose={() => {
          if (!deleting) {
            setPrestamoParaEliminar(null);
          }
        }}
        onConfirm={confirmarEliminacion}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={cerrarNotificacion}
      />
    </Box>
  );
}

export default Prestamos;