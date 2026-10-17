document.addEventListener("DOMContentLoaded", () => {
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
});