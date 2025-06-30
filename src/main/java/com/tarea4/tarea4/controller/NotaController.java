package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.dto.NotaRequest;
import com.tarea4.tarea4.model.Actividad;
import com.tarea4.tarea4.model.Nota;
import com.tarea4.tarea4.repository.ActividadRepository;
import com.tarea4.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaRepository notaRepo;

    @Autowired
    private ActividadRepository actividadRepo;

    @PostMapping
    public ResponseEntity<?> agregar(@RequestBody NotaRequest req) {
        if (req.getNota() < 1 || req.getNota() > 7) {
            return ResponseEntity.badRequest().body("Nota inválida.");
        }

        Actividad act = actividadRepo.findById(req.getActividadId()).orElse(null);
        if (act == null) return ResponseEntity.notFound().build();

        Nota n = new Nota();
        n.setNota(req.getNota());
        n.setActividad(act);
        notaRepo.save(n);

        return ResponseEntity.ok(act.promedioNotas());
    }
}
