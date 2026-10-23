import API from "./api";

export interface DocenteRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  colegio: string;
  curso: string;
}

export async function registrarDocente(docente: DocenteRegistro) {
  const respuesta = await fetch(`${API}/docentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(docente),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const mensaje =
      datos.message ||
      (datos.errors && Object.values(datos.errors).flat().join(" ")) ||
      "Error al registrar docente";
    throw new Error(mensaje);
  }

  return datos;
}

export async function iniciarSesionDocente(correo: string, password: string) {
  const respuesta = await fetch(`${API}/docentes/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      correo: correo.trim().toLowerCase(), 
      password 
    }),
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    if (respuesta.status === 429) {
      throw new Error("Demasiados intentos de acceso fallidos. Por seguridad, espera 1 minuto.");
    }
    throw new Error(datos.message || "Credenciales inválidas.");
  }

  return datos.docente;
}
