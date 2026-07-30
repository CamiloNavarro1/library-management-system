import api from "../api/axios";

const BASE_PATH = "/prestamos";

export const obtenerPrestamos = async () => {
  const response = await api.get(BASE_PATH);
  return response.data;
};

export const obtenerPrestamoPorId = async (id) => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const crearPrestamo = async (prestamo) => {
  const response = await api.post(BASE_PATH, prestamo);
  return response.data;
};

export const actualizarPrestamo = async (id, prestamo) => {
  const response = await api.put(`${BASE_PATH}/${id}`, prestamo);
  return response.data;
};

export const devolverPrestamo = async (id) => {
  const response = await api.patch(`${BASE_PATH}/${id}/devolver`);
  return response.data;
};

export const eliminarPrestamo = async (id) => {
  await api.delete(`${BASE_PATH}/${id}`);
};

export const obtenerPrestamosPorUsuario = async (usuarioId) => {
  const response = await api.get(`${BASE_PATH}/usuario/${usuarioId}`);
  return response.data;
};

export const obtenerPrestamosPorLibro = async (libroId) => {
  const response = await api.get(`${BASE_PATH}/libro/${libroId}`);
  return response.data;
};

const prestamoService = {
  obtenerPrestamos,
  obtenerPrestamoPorId,
  crearPrestamo,
  actualizarPrestamo,
  devolverPrestamo,
  eliminarPrestamo,
  obtenerPrestamosPorUsuario,
  obtenerPrestamosPorLibro,
};

export default prestamoService;