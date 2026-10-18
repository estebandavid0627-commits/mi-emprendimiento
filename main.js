document.addEventListener("DOMContentLoaded", () => {
  
  // 1. CARGA DINÁMICA DEL CATÁLOGO DESDE JSON
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let serviciosData = [];

  async function cargarServicios() {
    try {
      const response = await fetch("config.json");
      if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
      
      serviciosData = await response.json();
      renderizarServicios(serviciosData);
    } catch (error) {
      console.error("Error cargando los servicios:", error);
      if (serviciosContainer) {
        serviciosContainer.innerHTML = `<p class="form-status-msg error">Error al cargar el catálogo de servicios.</p>`;
      }
    }
  }

  function renderizarServicios(servicios) {
    if (!serviciosContainer) return;
    
    serviciosContainer.innerHTML = "";

    servicios.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "glass-card";

      const detallesHTML = servicio.detalles 
        ? `<ul class="service-details-list">${servicio.detalles.map(d => `<li>${d}</li>`).join('')}</ul>` 
        : '';

      card.innerHTML = `
        <div class="icon-wrapper"><i data-lucide="${servicio.icono}"></i></div>
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        ${detallesHTML}
        <div class="card-footer-link">Ver alcance <i data-lucide="chevron-right"></i></div>
      `;

      serviciosContainer.appendChild(card);
    });

    // Re-inicializar iconos de Lucide para elementos inyectados en el DOM
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Filtrado de servicios
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const categoria = btn.getAttribute("data-category");
      if (categoria === "Todos") {
        renderizarServicios(serviciosData);
      } else {
        const filtrados = serviciosData.filter(s => s.categoria === categoria);
        renderizarServicios(filtrados);
      }
    });
  });

  // Carga inicial
  cargarServicios();

  // 2. FORMULARIO DE CONTACTO (FORMSPREE)
  const form = document.getElementById("formularioContacto");
  const status = document.getElementById("form-status");
  const btnEnviar = document.getElementById("btnEnviar");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      if (btnEnviar) btnEnviar.disabled = true;
      status.className = "form-status-msg";
      status.innerHTML = "Enviando tu mensaje...";

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = "form-status-msg success";
          status.innerHTML = "¡Gracias! Tu consulta ha sido enviada con éxito. El equipo de Orion Digital Partners te contactará en breve.";
          form.reset();
        } else {
          const result = await response.json();
          status.className = "form-status-msg error";
          status.innerHTML = (result && result.errors) 
            ? result.errors.map(e => e.message).join(", ") 
            : "Hubo un inconveniente al enviar la consulta.";
        }
      } catch (error) {
        status.className = "form-status-msg error";
        status.innerHTML = "Error de conexión. Revisa tu internet e inténtalo nuevamente.";
      } finally {
        if (btnEnviar) btnEnviar.disabled = false;
      }
    });
  }

  // 3. MODAL DE LOGIN / ADMIN
  const openLoginBtn = document.getElementById("openLoginBtn");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");

  if (openLoginBtn && loginModal && closeLoginBtn) {
    openLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("active");
    });

    closeLoginBtn.addEventListener("click", () => {
      loginModal.classList.remove("active");
    });

    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) loginModal.classList.remove("active");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("adminUser").value;
      const pass = document.getElementById("adminPass").value;

      if (user === "admin@orion.com" && pass === "orion2026") {
        loginStatus.className = "form-status-msg success";
        loginStatus.innerHTML = "Autenticación exitosa. Redirigiendo al panel...";
        setTimeout(() => {
          alert("¡Bienvenido a la consola administrativa de Orion Digital Partners!");
          loginModal.classList.remove("active");
          loginForm.reset();
          loginStatus.innerHTML = "";
        }, 1200);
      } else {
        loginStatus.className = "form-status-msg error";
        loginStatus.innerHTML = "Credenciales incorrectas. Intenta con admin@orion.com / orion2026";
      }
    });
  }

});