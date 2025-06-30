package com.tarea4.tarea4.controller;

import com.tarea4.tarea4.model.Actividad;
import com.tarea4.tarea4.model.Nota;
import com.tarea4.tarea4.repository.ActividadRepository;
import com.tarea4.tarea4.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepo;

    @Autowired
    private NotaRepository notaRepo;

    @GetMapping("/")
    public String verActividades(Model model) {
        List<Actividad> actividades = actividadRepo.findByDiaHoraTerminoBefore(LocalDateTime.now());
        model.addAttribute("actividades", actividades);
        return "index";
    }

    @PostMapping("/evaluar")
    public String evaluarNota(@RequestParam("actividadId") Long actividadId,
                              @RequestParam("nota") Integer nota,
                              Model model) {
        if (nota < 1 || nota > 7) {
            model.addAttribute("error", "Nota inválida.");
        } else {
            Actividad act = actividadRepo.findById(actividadId).orElse(null);
            if (act != null) {
                Nota n = new Nota();
                n.setActividad(act);
                n.setNota(nota);
                notaRepo.save(n);
            }
        }

        // Recargar actividades después de evaluar
        List<Actividad> actividades = actividadRepo.findByDiaHoraTerminoBefore(LocalDateTime.now());
        model.addAttribute("actividades", actividades);
        return "index";
    }
}
