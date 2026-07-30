import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  AutoStories as AutoStoriesIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  SwapHoriz as SwapHorizIcon,
} from "@mui/icons-material";

import { obtenerUsuarios } from "../services/usuarioService";
import { obtenerLibros } from "../services/libroService";
import { obtenerPrestamos } from "../services/prestamoService";

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

const obtenerEstadoPrestamo = (prestamo) =>
  String(
    prestamo?.estadoPrestamo ||
      prestamo?.estado ||
      ""
  ).toUpperCase();

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

function StatCard({ title, value, subtitle, icon }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              {title}
            </Typography>

            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [usuariosData, librosData, prestamosData] = await Promise.all([
        obtenerUsuarios(),
        obtenerLibros(),
        obtenerPrestamos(),
      ]);

      setUsuarios(normalizarLista(usuariosData));
      setLibros(normalizarLista(librosData));
      setPrestamos(normalizarLista(prestamosData));
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.message ||
          "No fue posible obtener la información del Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const prestamosActivos = useMemo(
    () =>
      prestamos.filter((prestamo) =>
        ["ACTIVO", "PRESTADO"].includes(obtenerEstadoPrestamo(prestamo))
      ),
    [prestamos]
  );

  const ultimosPrestamos = useMemo(() => {
    return [...prestamos]
      .sort((a, b) => {
        const fechaA = new Date(a.fechaPrestamo || 0).getTime();
        const fechaB = new Date(b.fechaPrestamo || 0).getTime();

        return fechaB - fechaA;
      })
      .slice(0, 5);
  }, [prestamos]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography color="text.secondary">
            Consultando información de la biblioteca...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4">Dashboard</Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen general del sistema de gestión de biblioteca.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={cargarDatos}
        >
          Actualizar
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={cargarDatos}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <StatCard
          title="Usuarios registrados"
          value={usuarios.length}
          subtitle="Lectores disponibles en el sistema"
          icon={<PeopleIcon />}
        />

        <StatCard
          title="Libros registrados"
          value={libros.length}
          subtitle="Títulos incluidos en el catálogo"
          icon={<MenuBookIcon />}
        />

        <StatCard
          title="Préstamos totales"
          value={prestamos.length}
          subtitle="Histórico de operaciones registradas"
          icon={<SwapHorizIcon />}
        />

        <StatCard
          title="Préstamos activos"
          value={prestamosActivos.length}
          subtitle="Ejemplares pendientes de devolución"
          icon={<AutoStoriesIcon />}
        />
      </Box>

      <Paper
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6">Préstamos recientes</Typography>

          <Typography variant="body2" color="text.secondary">
            Últimos movimientos registrados en el sistema.
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Libro o ejemplar</TableCell>
                <TableCell>Fecha de préstamo</TableCell>
                <TableCell>Fecha límite</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ultimosPrestamos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 5 }}>
                      <AutoStoriesIcon
                        sx={{
                          fontSize: 44,
                          color: "text.disabled",
                          mb: 1,
                        }}
                      />

                      <Typography color="text.secondary">
                        Todavía no hay préstamos registrados.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                ultimosPrestamos.map((prestamo) => {
                  const estado = obtenerEstadoPrestamo(prestamo);
                  const activo = ["ACTIVO", "PRESTADO"].includes(estado);

                  const usuario =
                    prestamo.usuarioNombre ||
                    prestamo.nombreUsuario ||
                    prestamo.usuario?.nombreCompleto ||
                    `${prestamo.usuario?.nombre || ""} ${
                      prestamo.usuario?.apellido || ""
                    }`.trim() ||
                    `Usuario #${prestamo.usuarioId || "N/D"}`;

                  const libro =
                    prestamo.tituloLibro ||
                    prestamo.libroTitulo ||
                    prestamo.ejemplar?.libro?.titulo ||
                    prestamo.libro?.titulo ||
                    prestamo.codigoInventario ||
                    `Ejemplar #${prestamo.ejemplarId || "N/D"}`;

                  return (
                    <TableRow hover key={prestamo.id}>
                      <TableCell>{usuario}</TableCell>

                      <TableCell>{libro}</TableCell>

                      <TableCell>
                        {formatearFecha(prestamo.fechaPrestamo)}
                      </TableCell>

                      <TableCell>
                        {formatearFecha(
                          prestamo.fechaDevolucion ||
                            prestamo.fechaDevolucionPrevista ||
                            prestamo.fechaLimite
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={estado || "SIN ESTADO"}
                          color={
                            estado === "VENCIDO"
                              ? "error"
                              : activo
                              ? "success"
                              : "default"
                          }
                          variant={estado ? "filled" : "outlined"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}

export default Dashboard;