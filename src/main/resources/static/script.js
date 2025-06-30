function evaluar(id, btn) {
    console.log("Evaluar llamada con id:", id);
    const nota = parseInt(prompt("Ingrese una nota del 1 al 7:"));
    console.log("Nota ingresada:", nota);

    if (isNaN(nota) || nota < 1 || nota > 7) {
        alert("Nota inválida.");
        return;
    }

    fetch('/api/notas', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actividadId: id, nota })
    })
    .then(res => {
        console.log("Respuesta status:", res.status);
        if (!res.ok) throw new Error("Error al enviar nota");
        return res.json();
    })
    .then(nuevoPromedio => {
        console.log("Nuevo promedio recibido:", nuevoPromedio);
        const tdNota = btn.closest("tr").querySelector(".nota");
        tdNota.textContent = nuevoPromedio.toFixed(1);
    })
    .catch(err => {
        console.error("Error en fetch:", err);
        alert(err);
    });
}
