document.addEventListener("DOMContentLoaded", () => {
  const filas = document.querySelectorAll("tbody tr");

  filas.forEach(fila => {
    fila.addEventListener("click", () => {
      const id = fila.getAttribute("data-id");

      fetch(`/actividad/${id}`)
        .then(response => {
          if (!response.ok) throw new Error('No se pudo obtener la actividad');
          return response.json();
        })
        .then(data => {
          const detalleDiv = document.getElementById("detalle-actividad");
          const contenidoDiv = document.getElementById("detalle-contenido");

          let html = `
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Celular:</strong> ${data.celular || 'No disponible'}</p>
            <p><strong>Inicio:</strong> ${new Date(data.dia_hora_inicio).toLocaleString()}</p>
            <p><strong>Término:</strong> ${data.dia_hora_termino ? new Date(data.dia_hora_termino).toLocaleString() : 'No especificado'}</p>
            <p><strong>Descripción:</strong> ${data.descripcion}</p>
            <p><strong>Comuna:</strong> ${data.comuna}</p>
            <p><strong>Sector:</strong> ${data.sector || 'No especificado'}</p>
            <p><strong>Temas:</strong> ${data.temas.map(t => t.tema + (t.tema === 'otro' && t.glosa_otro ? ` (${t.glosa_otro})` : '')).join(', ')}</p>
            <p><strong>Contactos:</strong> ${data.contactos.map(c => `${c.nombre}: ${c.identificador}`).join(', ')}</p>
            <p><strong>Fotos:</strong></p>
            <div>
              ${data.fotos.length > 0 ? data.fotos.map(f => `<img src="${f}" width="100" style="margin-right:10px;" />`).join('') : 'Sin imágenes'}
            </div>
          `;

          contenidoDiv.innerHTML = html;
          detalleDiv.style.display = "block";
          detalleDiv.scrollIntoView({ behavior: "smooth" });
        })
        .catch(error => {
          alert("Error al cargar la actividad: " + error.message);
        });
    });
  });
});
