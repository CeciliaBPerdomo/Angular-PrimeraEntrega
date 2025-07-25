import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Models y servicios
import { Curso } from '../../../models/curso.model';
import { Alumno } from '../../../models/alumno.model';

import { CursoService } from '../../../services/curso.service';
import { AlumnoService } from '../../../services/alumno.service';
import { InscripcionService } from '../../../services/inscripcion.service';

import { EstadoInscripcion } from '../../../models/inscripcion.model';

interface CursoConEstado extends Curso {
  estado: EstadoInscripcion;
}

// Material UI
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mis-cursos',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './mis-cursos.html',
  styleUrls: ['./mis-cursos.css']
})

export class MisCursos {
  alumno: Alumno | undefined;
  cursosDelAlumno: CursoConEstado[] = [];

  constructor(
    private alumnoService: AlumnoService,
    private inscripcionService: InscripcionService,
    private cursoService: CursoService
  ) { }

  ngOnInit(): void {
    const idAlumno = 1; 
    this.alumno = this.alumnoService.getAlumnoPorId(idAlumno);

    const todosCursos = this.cursoService.getCursos();
    const inscripciones = this.inscripcionService.getInscripciones().filter(
      insc => insc.alumnoId === idAlumno
    );

    // Cursos con inscripción (con estado)
    const cursosConInscripcion: CursoConEstado[] = inscripciones.map(insc => {
      const curso = todosCursos.find(c => c.id === insc.cursoId);
      return curso ? { ...curso, estado: insc.estado } : null;
    }).filter((curso): curso is CursoConEstado => curso !== null);

    // Curso asignado directamente al alumno (sin inscripción)
    const cursoAsignado = todosCursos.find(c => c.id === this.alumno?.cursoId);

    // Si el curso asignado no está en cursosConInscripcion, lo agregamos con estado 'sin inscripcion'
    if (cursoAsignado && !cursosConInscripcion.some(c => c.id === cursoAsignado.id)) {
      cursosConInscripcion.push({ ...cursoAsignado, estado: 'sin inscripcion' });
    }

    this.cursosDelAlumno = cursosConInscripcion;
  }
}
