import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
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

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Notification from "../components/Notification";
import UsuarioFormDialog from "../components/UsuarioFormDialog";

import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
} from "../services/usuarioService";

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

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const cargarUsuarios = useCallback(async () => {
    setLoading(true);

    try {
      const data = await obtenerUsuarios();
      setUsuarios(normalizarLista(data));
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible cargar los usuarios.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const usuariosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return usuarios;
    }

    return usuarios.filter((usuario) => {
      const fullText = [
        usuario.nombre,
        usuario.apellido,
        usuario.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return fullText.includes(term);
    });
  }, [usuarios, search]);

  const usuariosPaginados = useMemo(() => {
    const start = page * rowsPerPage;

    return usuariosFiltrados.slice(
      start,
      start + rowsPerPage
    );
  }, [usuariosFiltrados, page, rowsPerPage]);

  useEffect(() => {
    const lastAvailablePage = Math.max(
      0,
      Math.ceil(usuariosFiltrados.length / rowsPerPage) - 1
    );

    if (page > lastAvailablePage) {
      setPage(lastAvailablePage);
    }
  }, [usuariosFiltrados.length, page, rowsPerPage]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (formData) => {
    setSaving(true);

    try {
      if (selectedUser?.id) {
        await actualizarUsuario(selectedUser.id, formData);

        showNotification(
          "El usuario se actualizó correctamente."
        );
      } else {
        await crearUsuario(formData);

        showNotification(
          "El usuario se creó correctamente."
        );
      }

      setFormOpen(false);
      setSelectedUser(null);

      await cargarUsuarios();
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible guardar el usuario.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await eliminarUsuario(userToDelete.id);

      showNotification(
        "El usuario se eliminó correctamente."
      );

      setUserToDelete(null);
      await cargarUsuarios();
    } catch (error) {
      console.error(error);

      showNotification(
        error.message || "No fue posible eliminar el usuario.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading && usuarios.length === 0) {
    return (
      <LoadingState message="Cargando usuarios..." />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Usuarios"
        description="Administra los lectores registrados en la biblioteca."
        actionLabel="Nuevo usuario"
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
            placeholder="Buscar por nombre, apellido o correo..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: 420,
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

        {usuariosFiltrados.length === 0 ? (
          <EmptyState
            icon={<PeopleIcon sx={{ fontSize: 34 }} />}
            title={
              search
                ? "No se encontraron usuarios"
                : "No hay usuarios registrados"
            }
            description={
              search
                ? "Prueba con otro nombre, apellido o correo electrónico."
                : "Crea el primer usuario para comenzar a gestionar préstamos."
            }
            actionLabel={!search ? "Crear usuario" : undefined}
            onAction={!search ? handleOpenCreate : undefined}
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre completo</TableCell>
                    <TableCell>Correo electrónico</TableCell>
                    <TableCell>Fecha de nacimiento</TableCell>
                    <TableCell align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {usuariosPaginados.map((usuario) => (
                    <TableRow hover key={usuario.id}>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {usuario.nombre} {usuario.apellido}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {usuario.email}
                      </TableCell>

                      <TableCell>
                        {formatearFecha(usuario.fechaNacimiento)}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Editar usuario">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleOpenEdit(usuario)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            color="error"
                            onClick={() =>
                              setUserToDelete(usuario)
                            }
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
              count={usuariosFiltrados.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(
                  Number(event.target.value)
                );
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

      <UsuarioFormDialog
        open={formOpen}
        usuario={selectedUser}
        loading={saving}
        onClose={handleCloseForm}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Eliminar usuario"
        description={
          userToDelete
            ? `¿Deseas eliminar a ${userToDelete.nombre} ${userToDelete.apellido}? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onClose={() => {
          if (!deleting) {
            setUserToDelete(null);
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

export default Usuarios;