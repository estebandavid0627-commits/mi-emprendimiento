document.addEventListener("DOMContentLoaded", () => {
  
  // 1. CARGA DINÁMICA DEL CATÁLOGO DESDE JSON (config.json / servicios.json)
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let serviciosData = [];

  async function cargarServicios() {
    try {
      let response = await fetch("config.json");
      if (!response.ok) {
        response = await fetch("servicios.json");
      }
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

  // 4. LÓGICA DEL ASISTENTE VIRTUAL / CHATBOT CON IA
  const chatbotToggleBtn = document.getElementById("chatbotToggleBtn");
  const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
  const chatbotBox = document.getElementById("chatbotBox");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotMessages = document.getElementById("chatbotMessages");

  if (chatbotToggleBtn && chatbotBox && chatbotCloseBtn) {
    chatbotToggleBtn.addEventListener("click", () => {
      chatbotBox.classList.toggle("active");
    });

    chatbotCloseBtn.addEventListener("click", () => {
      chatbotBox.classList.remove("active");
    });
  }

  if (chatbotForm) {
    chatbotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userText = chatbotInput.value.trim();
      if (!userText) return;

      appendMessage(userText, "user-msg");
      chatbotInput.value = "";

      setTimeout(() => {
        const botReply = procesarConsultaIA(userText);
        appendMessage(botReply, "bot-msg");
      }, 500);
    });
  }

  function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${className}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function procesarConsultaIA(consulta) {
    const texto = consulta.toLowerCase();

    if (texto.includes("web") || texto.includes("software") || texto.includes("página") || texto.includes("desarrollo")) {
      return "En **Desarrollo Web & Software** construimos plataformas modernas y escalables. Puedes agendar una sesión en nuestro formulario de contacto.";
    } else if (texto.includes("dato") || texto.includes("analitica") || texto.includes("estrategia")) {
      return "En **Análisis & Estrategia**, creamos tableros BI y modelos econométricos para potenciar decisiones clave de negocio.";
    } else if (texto.includes("seguridad") || texto.includes("hack") || texto.includes("proteger")) {
      return "Nuestra área de **Seguridad** implementa modelos Zero-Trust para garantizar inmutabilidad y protección de tus datos.";
    } else if (texto.includes("automatiz") || texto.includes("proceso") || texto.includes("rpa")) {
      return "Con **Optimización de Procesos**, automatizamos flujos de trabajo clave para incrementar la eficiencia operativa hasta 2.5x.";
    } else if (texto.includes("hola") || texto.includes("buenos") || texto.includes("saludos")) {
      return "¡Hola! ¿En qué área de consultoría digital o desarrollo podemos colaborarte hoy?";
    } else if (texto.includes("precio") || texto.includes("costo") || texto.includes("cotiz")) {
      return "Diseñamos soluciones a la medida. Envíanos un mensaje en el formulario para coordinar un diagnóstico gratuito.";
    } else {
      return "En Orion Digital Partners ofrecemos consultoría en software, datos, seguridad y automatización. ¿Te gustaría agendar una reunión corporativa?";
    }
  }

});