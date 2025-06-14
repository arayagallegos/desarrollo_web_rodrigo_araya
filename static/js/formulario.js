window.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("actividad-form");
  const contactoSelect = document.getElementById("contactar");
  const contactosContainer = document.getElementById("contactos");
  const agregarFotoBtn = document.getElementById("agregar-foto");
  const fotosDiv = document.getElementById("fotos");
  const temaSelect = document.getElementById("tema");
  const otroTemaDiv = document.getElementById("otro-tema-div");
  const inicioInput = document.getElementById("inicio");
  const terminoInput = document.getElementById("termino");



  // Prellenar fecha de término como 3h después del inicio
  inicioInput.addEventListener("change", () => {
    const inicio = new Date(inicioInput.value);
    if (!isNaN(inicio.getTime())) {
      const termino = new Date(inicio.getTime() + 3 * 60 * 60 * 1000/2 - 3 * 60 * 60 * 1000 + 30*60*1000);
      terminoInput.value = termino.toISOString().slice(0, 16);
    }
  });

  // Agregar campo de texto si se selecciona "otro" en tema

  const handleTemaChange = () => {
    const seleccionados = Array.from(temaSelect.selectedOptions).map(opt => opt.value);
    const contieneOtro = seleccionados.includes("otro");

    if (contieneOtro) {
      otroTemaDiv.innerHTML = `
        <label for="glosa_otro">Tema personalizado:</label>
        <input type="text" name="glosa_otro" id="glosa-otro" minlength="3" maxlength="15" placeholder="Escribe tu tema">
      `;
    } else {
      otroTemaDiv.innerHTML = "";
    }
  };

  temaSelect.addEventListener("change", handleTemaChange);


  // Agregar otra foto
  agregarFotoBtn.addEventListener("click", () => {
    const total = fotosDiv.querySelectorAll('input[type="file"]').length;
    if (total >= 5) return;
    const input = document.createElement("input");
    input.type = "file";
    input.name = "foto";
    input.accept = "image/*";
    fotosDiv.appendChild(input);
    fotosDiv.appendChild(document.createElement("br"));
  });

  //Contactar por: genera inputs por cada opción seleccionada
  contactoSelect.addEventListener("change", () => {
    contactosContainer.innerHTML = "";
    const seleccionados = Array.from(contactoSelect.selectedOptions).map(o => o.value);
    seleccionados.forEach(metodo => {
      const div = document.createElement("div");
      const label = document.createElement("label");
      label.textContent = `ID/URL de ${metodo}: `;
      const input = document.createElement("input");
      input.type = "text";
      input.name = `contacto-${metodo}`;
      input.minLength = 4;
      input.maxLength = 50;
      div.appendChild(label);
      div.appendChild(input);
      contactosContainer.appendChild(div);
    });
  });

  // Validación al enviar form
  formulario.addEventListener("submit", (e) => {
    const errores = [];

    const nombre = formulario["nombre"].value.trim();
    const email = formulario["email"].value.trim();
    const celular = formulario["celular"].value.trim();
    const sector = formulario["sector"].value.trim();
    const region = formulario["region"].value;
    const comuna = formulario["comuna"].value;
    const descripcion = formulario["descripcion"].value.trim();
    const tema = Array.from(temaSelect.selectedOptions).map(o => o.value);
    const glosaOtroInput = document.getElementById("glosa-otro");
    const fotos = fotosDiv.querySelectorAll('input[type="file"]');
    const inicio = formulario["inicio"].value;
    const termino = formulario["termino"].value;

    // Nombre
    if (nombre.length < 5 || nombre.length > 200) errores.push("Nombre");

    // Email
    const emailRegex = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(email) || email.length <= 15) errores.push("Email");

    //Celular 
    if (celular) {
      const phoneRegex = /^\+\d{3}\.\d{8}$/;
      if (!phoneRegex.test(celular) || celular.length < 12) errores.push("Celular");
    }

    // Sector
    if (sector && (sector.length < 5 || sector.length > 100)) errores.push("Sector");

    // Región y comuna
    if (!region) errores.push("Región");
    if (!comuna) errores.push("Comuna");

    // Descripción
    if (!descripcion) errores.push("Descripción");

    // Tema
    if (tema.length === 0) errores.push("Tema");
    if (tema.includes("otro") && (!glosaOtroInput || glosaOtroInput.value.trim().length < 3 || glosaOtroInput.value.trim().length > 15)) {
      errores.push("Glosa otro");
    }

    // Fotos
    if (fotos.length < 1 || fotos.length > 5) errores.push("Fotos");
    for (const f of fotos) {
      if (f.files.length > 0 && !f.files[0].type.startsWith("image/")) {
        errores.push("Solo se permiten imágenes");
        break;
      }
    }

    // Fechas
    if (!inicio) errores.push("Inicio");
    if (termino && new Date(inicio) >= new Date(termino)) errores.push("Término debe ser después del inicio");

    // Contactar por
    const contactMetodos = Array.from(contactoSelect.selectedOptions).map(o => o.value);
    for (const metodo of contactMetodos) {
      const input = formulario[`contacto-${metodo}`];
      if (!input || input.value.trim().length < 4 || input.value.trim().length > 50) {
        errores.push(`ID/URL de ${metodo}`);
      }
    }

    if (errores.length > 0) {
      e.preventDefault();
      alert("Errores en el formulario:\n" + errores.join("\n"));
    }
  });
});
