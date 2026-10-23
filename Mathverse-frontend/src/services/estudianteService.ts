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

// Iniciar sesión de estudiante seguro
export async function iniciarSesion(correo: string, password: string) {
  const respuesta = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: correo.trim().toLowerCase(),
      password,
    }),
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    if (respuesta.status === 429) {
      throw new Error("Demasiados intentos de acceso fallidos. Por seguridad, espera 1 minuto.");
    }
    throw new Error(datos.message || "Credenciales inválidas");
  }

  return datos.estudiante;
}

// Obtener todos los estudiantes
export async function obtenerEstudiantes() {
  const respuesta = await fetch(`${API}/estudiantes`);
  return await respuesta.json();
}

// Actualizar META Points del estudiante
export async function actualizarMetaPoints(
  estudianteId: number,
  puntosGanados: number
) {
  const respuesta = await fetch(
    `${API}/estudiantes/${estudianteId}/meta-points`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meta_points: puntosGanados,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "Error al actualizar META Points.");
  }

  return datos;
}
