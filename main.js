document.addEventListener("DOMContentLoaded", () => {
  // LÓGICA DE ENVÍO DE FORMULARIO DE CONTACTO
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
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          status.className = "form-status-msg success";
          status.innerHTML = "¡Gracias! Tu consulta ha sido enviada con éxito. El equipo de Orion Digital Partners te contactará en breve.";
          form.reset();
        } else {
          const result = await response.json();
          status.className = "form-status-msg error";
          if (result && result.errors) {
            status.innerHTML = result.errors.map(error => error.message).join(", ");
          } else {
            status.innerHTML = "Hubo un inconveniente al enviar la consulta. Inténtalo de nuevo.";
          }
        }
      } catch (error) {
        status.className = "form-status-msg error";
        status.innerHTML = "Error de conexión. Revisa tu internet e inténtalo nuevamente.";
      } finally {
        if (btnEnviar) btnEnviar.disabled = false;
      }
    });
  }

  // LÓGICA DEL MODAL DE LOGIN / ADMIN
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
      if (e.target === loginModal) {
        loginModal.classList.remove("active");
      }
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