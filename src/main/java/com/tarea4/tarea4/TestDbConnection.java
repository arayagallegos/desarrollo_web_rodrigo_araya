package com.tarea4.tarea4;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.tarea4.tarea4.repository.ActividadRepository;

@Component
public class TestDbConnection implements CommandLineRunner {

    @Autowired
    private ActividadRepository repo;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Número de actividades en BD: " + repo.count());
        System.out.println("Primeras actividades: " + repo.findAll().stream().limit(3).toList());
    }
}
