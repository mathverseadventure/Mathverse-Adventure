import API from "./api";

export async function obtenerProgreso(estudianteId: number) {
  const respuesta = await fetch(`${API}/progreso/${estudianteId}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el progreso.");
  }

  return await respuesta.json();
}

export async function actualizarProgreso(estudianteId: number, progreso: any) {
  const respuesta = await fetch(`${API}/progreso/${estudianteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(progreso),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el progreso.");
  }

  return await respuesta.json();
}