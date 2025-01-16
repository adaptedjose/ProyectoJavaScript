document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.getElementById('carrusel');
    const images = carrusel.children;
    const botonAnterior = document.getElementById('botonAnterior');
    const botonSiguiente = document.getElementById('botonSiguiente');
  
    const totalImages = images.length;
    let currentIndex = 0;
  
    const actualizarCarrusel = () => {
      const offset = -currentIndex * 100; // Mover el track según el índice
      carrusel.style.transform = `translateX(${offset}%)`;
    };
  
    const irSiguiente = () => {
      currentIndex = (currentIndex + 1) % totalImages;
      actualizarCarrusel();
    };
  
    const irAnterior = () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      actualizarCarrusel();
    };
  
   botonSiguiente.addEventListener('click', irSiguiente);
   botonAnterior.addEventListener('click', irAnterior);
  
    // Animación automática
    setInterval(irSiguiente, 3000); // Cambiar de imagen cada 3 segundos
  });