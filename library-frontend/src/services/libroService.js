import api from "../api/axios";

const BASE_PATH = "/libros";

export const obtenerLibros = async () => {
  const response = await api.get(BASE_PATH);
  return response.data;
};

export const obtenerLibroPorId = async (id) => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const crearLibro = async (libro) => {
  const response = await api.post(BASE_PATH, libro);
  return response.data;
};

export const actualizarLibro = async (id, libro) => {
  const response = await api.put(`${BASE_PATH}/${id}`, libro);
  return response.data;
};

export const eliminarLibro = async (id) => {
  await api.delete(`${BASE_PATH}/${id}`);
};

export const agregarEjemplar = async (libroId, ejemplar) => {
  const response = await api.post(
    `${BASE_PATH}/${libroId}/ejemplares`,
    ejemplar
  );

  return response.data;
};

export const obtenerEjemplaresDisponibles = async (isbn) => {
  const response = await api.get(
    `${BASE_PATH}/isbn/${encodeURIComponent(isbn)}/ejemplares-disponibles`
  );

  return response.data;
};

const libroService = {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  agregarEjemplar,
  obtenerEjemplaresDisponibles,
};

export default libroService;