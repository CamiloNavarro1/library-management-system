import api from "../api/axios";

const BASE_PATH = "/usuarios";

export const obtenerUsuarios = async () => {
  const response = await api.get(BASE_PATH);
  return response.data;
};

export const obtenerUsuarioPorId = async (id) => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await api.post(BASE_PATH, usuario);
  return response.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await api.put(`${BASE_PATH}/${id}`, usuario);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  await api.delete(`${BASE_PATH}/${id}`);
};

const usuarioService = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};

export default usuarioService;