document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/estadisticas/actividades_por_dia")
    .then(res => res.json())
    .then(data => {
      Highcharts.chart("grafico-lineas", {
        chart: { type: "line" },
        title: { text: "Actividades por día" },
        xAxis: { categories: data.map(d => d.dia) },
        yAxis: { title: { text: "Cantidad" } },
        series: [{ name: "Actividades", data: data.map(d => d.cantidad) }]
      });
    });

  fetch("/api/estadisticas/actividades_por_tipo")
    .then(res => res.json())
    .then(data => {
      Highcharts.chart("grafico-torta", {
        chart: { type: "pie" },
        title: { text: "Actividades por tipo" },
        series: [{
          name: "Cantidad",
          colorByPoint: true,
          data: data.map(item => ({ name: item.tipo, y: item.cantidad }))
        }]
      });
    });

  fetch("/api/estadisticas/actividades_por_horario")
    .then(res => res.json())
    .then(data => {
      const categorias = data.map(m => m.mes);
      Highcharts.chart("grafico-barras", {
        chart: { type: "column" },
        title: { text: "Actividades por horario (por mes)" },
        xAxis: { categories: categorias },
        yAxis: { title: { text: "Cantidad" } },
        series: [
          { name: "Mañana", data: data.map(m => m.manana) },
          { name: "Mediodía", data: data.map(m => m.mediodia) },
          { name: "Tarde", data: data.map(m => m.tarde) }
        ]
      });
    });
});