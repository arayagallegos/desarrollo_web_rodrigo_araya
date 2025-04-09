document.addEventListener("DOMContentLoaded", () => {
    const actividades = [
        {
            id: 1,
            inicio: "2025-03-28 12:00",
            termino: "2025-03-28 14:00",
            comuna: "Santiago",
            sector: "Beauchef 850, terraza",
            tema: "Escuela de Boxeo",
            organizador: "Juan Pérez",
            fotos: [
                "foto1.jpg", "foto2.jpg", "foto3.jpg"
            ]
        },
        {
            id: 2,
            inicio: "2025-03-29 19:00",
            termino: "2025-03-29 20:00",
            comuna: "Ñuñoa",
            sector: "Plaza Central",
            tema: "Cómo deshidratar fruta",
            organizador: "Ana Soto",
            fotos: [
                "foto1.jpg", "foto2.jpg"
            ]
        },
        {
            id: 3,
            inicio: "2025-03-30 18:00",
            termino: "",
            comuna: "Santiago",
            sector: "Parque O’Higgins",
            tema: "Música urbana",
            organizador: "Luis Torres",
            fotos: [
                "foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg"
            ]
        }
    ];

    const tablaActividades = document.getElementById("tabla-actividades");
    const detalleActividad = document.getElementById("detalle-actividad");
    const detalleContenido = document.getElementById("detalle-contenido");
    const modalImagen = document.getElementById("modal-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    // Función para mostrar los detalles de la actividad
    const mostrarDetalles = (id) => {
        const actividad = actividades.find(act => act.id === id);
        if (actividad) {
            let contenido = `
                <h3>Actividad: ${actividad.tema}</h3>
                <p><strong>Inicio:</strong> ${actividad.inicio}</p>
                <p><strong>Término:</strong> ${actividad.termino || "Sin terminar"}</p>
                <p><strong>Comuna:</strong> ${actividad.comuna}</p>
                <p><strong>Sector:</strong> ${actividad.sector}</p>
                <p><strong>Organizador:</strong> ${actividad.organizador}</p>
                <p><strong>Fotos:</strong></p>
                <div id="fotos-actividad">`;

            actividad.fotos.forEach(foto => {
                contenido += `
                    <img src="${foto}" alt="Foto actividad" width="320" height="240" onclick="verImagenAmpliada('${foto}')"/>
                `;
            });

            contenido += `</div>`;
            detalleContenido.innerHTML = contenido;
            detalleActividad.classList.remove("oculto");
        }
    };

    // Función para cerrar el modal de la imagen ampliada
    const cerrarImagen = () => {
        modalImagen.classList.add("oculto");
    };

    // Función para ver la imagen ampliada
    const verImagenAmpliada = (foto) => {
        imagenGrande.src = foto;
        modalImagen.classList.remove("oculto");
    };

    // Función para volver al listado
    const volverListado = () => {
        detalleActividad.classList.add("oculto");
    };

    // Agregar evento para cada fila de la tabla
    const filas = document.querySelectorAll(".actividad");
    filas.forEach(fila => {
        fila.addEventListener("click", () => {
            const actividadId = parseInt(fila.dataset.id);
            mostrarDetalles(actividadId);
        });
    });

    // Exponer la función de ver imagen ampliada para ser accesible en el HTML
    window.verImagenAmpliada = verImagenAmpliada;
    window.cerrarImagen = cerrarImagen;
    window.volverListado = volverListado;
});
