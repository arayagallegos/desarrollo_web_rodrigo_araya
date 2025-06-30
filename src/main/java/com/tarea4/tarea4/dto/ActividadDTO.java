package com.tarea4.tarea4.dto;

import com.tarea4.tarea4.model.Actividad;

public class ActividadDTO {
    public Integer id;
    public String fecha;
    public String sector;
    public String nombre;
    public String tema = "sin tema"; //mmm
    public String nota;

    public static ActividadDTO from(Actividad a) {
        ActividadDTO dto = new ActividadDTO();
        dto.id = a.getId();
        dto.fecha = a.getDiaHoraInicio().toLocalDate().toString();
        dto.sector = a.getSector();
        dto.nombre = a.getNombre();
        dto.nota = (a.promedioNotas() == null) ? "-" : String.format("%.1f", a.promedioNotas());
        return dto;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }
}
