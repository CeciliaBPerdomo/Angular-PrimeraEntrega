// src/app/models/inscripcion.model.ts

export type EstadoInscripcion = 'activa' | 'cancelada' | 'finalizada' | 'sin inscripcion';

export interface Inscripcion {
  id: number;
  alumnoId: number;
  cursoId: number;
  fechaInscripcion: Date;
  estado: EstadoInscripcion;
}
