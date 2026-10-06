document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.formulario');

    if (formulario) {
        formulario.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            formulario.reset();
        });
    }
});