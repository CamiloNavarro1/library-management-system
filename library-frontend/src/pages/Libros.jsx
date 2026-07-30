import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";

import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import LibroFormDialog from "../components/LibroFormDialog";
import EjemplarFormDialog from "../components/EjemplarFormDialog";

import {
  actualizarLibro,
  agregarEjemplar,
  crearLibro,
  eliminarLibro,
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

const formatearFecha = (fecha) => {
  if (!fecha) {
    return "Sin fecha";
  }

  const parsedDate = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

function Libros() {
  const [libros, setLibros] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingCopy, setAddingCopy] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [copyFormOpen, setCopyFormOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const cargarLibros = useCallback(async () => {
    setLoading(true);

    try {
      const data = await obtenerLibros();
      setLibros(normalizarLista(data));
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible cargar los libros.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarLibros();
  }, [cargarLibros]);

  const librosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return libros;
    }

    return libros.filter((libro) => {
      const fullText = [
        libro.titulo,
        libro.autor,
        libro.isbn,
        libro.edicion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fullText.includes(term);
    });
  }, [libros, search]);

  const librosPaginados = useMemo(() => {
    const start = page * rowsPerPage;

    return librosFiltrados.slice(start, start + rowsPerPage);
  }, [librosFiltrados, page, rowsPerPage]);

  useEffect(() => {
    const lastAvailablePage = Math.max(
      0,
      Math.ceil(librosFiltrados.length / rowsPerPage) - 1
    );

    if (page > lastAvailablePage) {
      setPage(lastAvailablePage);
    }
  }, [librosFiltrados.length, page, rowsPerPage]);

  const handleOpenCreate = () => {
    setSelectedBook(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (libro) => {
    setSelectedBook(libro);
    setFormOpen(true);
  };

  const handleOpenCopyForm = (libro) => {
    setSelectedBook(libro);
    setCopyFormOpen(true);
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setSelectedBook(null);
  };

  const handleCloseCopyForm = () => {
    if (addingCopy) {
      return;
    }

    setCopyFormOpen(false);
    setSelectedBook(null);
  };

  const handleSave = async (formData) => {
    setSaving(true);

    try {
      if (selectedBook?.id) {
        await actualizarLibro(selectedBook.id, formData);

        showNotification("El libro se actualizó correctamente.");
      } else {
        await crearLibro(formData);

        showNotification("El libro se creó correctamente.");
      }

      setFormOpen(false);
      setSelectedBook(null);

      await cargarLibros();
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible guardar el libro.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddCopy = async (formData) => {
    if (!selectedBook?.id) {
      return;
    }

    setAddingCopy(true);

    try {
      await agregarEjemplar(selectedBook.id, formData);

      showNotification("El ejemplar se agregó correctamente.");

      setCopyFormOpen(false);
      setSelectedBook(null);

      await cargarLibros();
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible agregar el ejemplar.",
        "error"
      );
    } finally {
      setAddingCopy(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await eliminarLibro(bookToDelete.id);

      showNotification("El libro se eliminó correctamente.");

      setBookToDelete(null);
      await cargarLibros();
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible eliminar el libro.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading && libros.length === 0) {
    return <LoadingState message="Cargando libros..." />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Libros"
        description="Administra el catálogo y los ejemplares de la biblioteca."
        actionLabel="Nuevo libro"
        onAction={handleOpenCreate}
      />

      <Paper
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Buscar por título, autor, ISBN o edición..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: 460,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {librosFiltrados.length === 0 ? (
          <EmptyState
            icon={<MenuBookIcon sx={{ fontSize: 34 }} />}
            title={
              search
                ? "No se encontraron libros"
                : "No hay libros registrados"
            }
            description={
              search
                ? "Prueba con otro título, autor, ISBN o edición."
                : "Crea el primer libro para comenzar a gestionar el catálogo."
            }
            actionLabel={!search ? "Crear libro" : undefined}
            onAction={!search ? handleOpenCreate : undefined}
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Libro</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell>Edición</TableCell>
                    <TableCell>Publicación</TableCell>
                    <TableCell align="center">Ejemplares</TableCell>
                    <TableCell align="center">Disponibles</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {librosPaginados.map((libro) => (
                    <TableRow hover key={libro.id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {libro.titulo}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {libro.autor}
                        </Typography>
                      </TableCell>

                      <TableCell>{libro.isbn}</TableCell>

                      <TableCell>{libro.edicion}</TableCell>

                      <TableCell>
                        {formatearFecha(libro.fechaPublicacion)}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={libro.totalEjemplares ?? 0}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={libro.ejemplaresDisponibles ?? 0}
                          size="small"
                          color={
                            Number(libro.ejemplaresDisponibles) > 0
                              ? "success"
                              : "default"
                          }
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Agregar ejemplar">
                          <IconButton
                            color="success"
                            onClick={() => handleOpenCopyForm(libro)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar libro">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(libro)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar libro">
                          <IconButton
                            color="error"
                            onClick={() => setBookToDelete(libro)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={librosFiltrados.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </>
        )}
      </Paper>

      <LibroFormDialog
        open={formOpen}
        libro={selectedBook}
        loading={saving}
        onClose={handleCloseForm}
        onSubmit={handleSave}
      />

      <EjemplarFormDialog
        open={copyFormOpen}
        libro={selectedBook}
        loading={addingCopy}
        onClose={handleCloseCopyForm}
        onSubmit={handleAddCopy}
      />

      <ConfirmDialog
        open={Boolean(bookToDelete)}
        title="Eliminar libro"
        description={
          bookToDelete
            ? `¿Deseas eliminar "${bookToDelete.titulo}"? También podrían eliminarse sus ejemplares asociados.`
            : ""
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onClose={() => {
          if (!deleting) {
            setBookToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />
    </Stack>
  );
}

export default Libros;