document.addEventListener("DOMContentLoaded", () => {
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");

  // Servicios oficiales directos en memoria
  const serviciosData = [
    {
      id: 1,
      titulo: "Desarrollo Web & Software a Medida (React)",
      categoria: "Desarrollo",
      icono: "code",
      imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      descripcion: "Aplicaciones web de alto rendimiento construidas con React, JSX y componentes modulares altamente escalables.",
      tiempoEstimado: "4 - 6 Semanas"
    },
    {
      id: 2,
      titulo: "Desarrollo Backend con Node.js & Express",
      categoria: "Desarrollo",
      icono: "server",
      imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
      descripcion: "Construcción de APIs RESTful seguras, enrutamiento eficiente y lógica de negocio orientada a microservicios.",
      tiempoEstimado: "3 - 5 Semanas"
    },
    {
      id: 3,
      titulo: "Bases de Datos & Persistencia MongoDB",
      categoria: "Desarrollo",
      icono: "database",
      imagen: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80",
      descripcion: "Modelado de bases de datos NoSQL, esquemas con Mongoose y operaciones CRUD optimizadas para baja latencia.",
      tiempoEstimado: "2 - 4 Semanas"
    },
    {
      id: 4,
      titulo: "Optimización de Procesos & Robots RPA",
      categoria: "Automatización",
      icono: "cpu",
      imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
      descripcion: "Automatización inteligente de tareas repetitivas mediante bots y scripts orientados a la eficiencia operativa.",
      tiempoEstimado: "3 - 5 Semanas"
    },
    {
      id: 5,
      titulo: "Ciberarquitectura & Defensa Zero-Trust",
      categoria: "Seguridad",
      icono: "shield",
      imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
      descripcion: "Auditorías de seguridad, protección de endpoints y diseño de políticas de acceso bajo el principio de desconfianza cero.",
      tiempoEstimado: "2 - 4 Semanas"
    }
  ];

  let categoriaActual = "Todos";

  function renderizarServicios(filtroCategoria = "Todos", busquedaQuery = "") {
    if (!serviciosContainer) return;
    serviciosContainer.innerHTML = "";

    const filtrados = serviciosData.filter(s => {
      const coincideCat = filtroCategoria === "Todos" || s.categoria === filtroCategoria;
      const coincideBusqueda = s.titulo.toLowerCase().includes(busquedaQuery.toLowerCase()) || 
                               s.descripcion.toLowerCase().includes(busquedaQuery.toLowerCase());
      return coincideCat && coincideBusqueda;
    });

    if (filtrados.length === 0) {
      serviciosContainer.innerHTML = `<p style="color: #9CA3AF; text-align: center; grid-column: 1/-1;">No se encontraron soluciones disponibles.</p>`;
      return;
    }

    filtrados.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "glass-card";
      card.innerHTML = `
        <img src="${servicio.imagen}" alt="${servicio.titulo}" class="card-banner-img">
        <div class="card-body-content">
          <h3>${servicio.titulo}</h3>
          <p>${servicio.descripcion}</p>
          <span style="color: #60A5FA; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; display: block;">⏱️ ${servicio.tiempoEstimado}</span>
        </div>
      `;
      serviciosContainer.appendChild(card);
    });
  }

  // Evento de búsqueda
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderizarServicios(categoriaActual, e.target.value);
    });
  }

  // Eventos de filtros por categoría
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categoriaActual = btn.getAttribute("data-category");
      renderizarServicios(categoriaActual, searchInput ? searchInput.value : "");
    });
  });

  // Render inicial al cargar
  renderizarServicios();
});