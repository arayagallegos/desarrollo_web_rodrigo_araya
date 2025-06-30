package com.tarea4.tarea4.repository;

import com.tarea4.tarea4.model.Actividad;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByDiaHoraTerminoBefore(LocalDateTime fecha);
}
