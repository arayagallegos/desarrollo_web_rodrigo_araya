package com.tarea4.tarea4.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    private Integer id;

    @Column(name = "sector")
    private String sector;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "dia_hora_inicio")
    private LocalDateTime diaHoraInicio;

    @Column(name = "dia_hora_termino")
    private LocalDateTime diaHoraTermino;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public LocalDateTime getDiaHoraInicio() { return diaHoraInicio; }
    public void setDiaHoraInicio(LocalDateTime diaHoraInicio) { this.diaHoraInicio = diaHoraInicio; }

    public LocalDateTime getDiaHoraTermino() { return diaHoraTermino; }
    public void setDiaHoraTermino(LocalDateTime diaHoraTermino) { this.diaHoraTermino = diaHoraTermino; }

    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }

    public Double promedioNotas() {
        if (notas == null || notas.isEmpty()) return null;
        return notas.stream().mapToInt(Nota::getNota).average().orElse(0.0);
    }

    @Override
    public String toString() {
        return "Actividad{" +
            "id=" + id +
            ", nombre='" + nombre + '\'' +
            ", diaHoraInicio=" + diaHoraInicio +
            ", diaHoraTermino=" + diaHoraTermino +
            ", sector='" + sector + '\'' +
            '}';
    }

}

