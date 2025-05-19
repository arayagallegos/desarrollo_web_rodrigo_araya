window.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");

  regionSelect.addEventListener("change", () => {
    const regionId = regionSelect.value;
    fetch(`/api/comunas?region=${regionId}`)
      .then((res) => res.json())
      .then((data) => {
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        data.forEach((comuna) => {
          const option = document.createElement("option");
          option.value = comuna.id;
          option.textContent = comuna.nombre;
          comunaSelect.appendChild(option);
        });
      });
  });
});