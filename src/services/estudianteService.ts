import API from "./api";

export interface Estudiante {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  edad: number;
  grado: string;
  avatar?: string;
}

// Registrar estudiante
export async function registrarEstudiante(estudiante: Estudiante) {
  const respuesta = await fetch(`${API}/estudiantes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estudiante),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "Error al registrar estudiante");
  }

  return datos;
}

// Iniciar sesión de estudiante
export async function iniciarSesion(correo: string, password: string) {
  const respuesta = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo,
      password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "Error al iniciar sesión");
  }

  return datos.estudiante;
}

// Obtener todos los estudiantes
export async function obtenerEstudiantes() {
  const respuesta = await fetch(`${API}/estudiantes`);
  return await respuesta.json();
}