//Photo library functions
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

  // Modal functions
  function openModal() {
    document.getElementById('modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
  }

//Function displaying rooms
function roomCards(elemHTML, rooms) {
    let numberRooms = "";

    let availabilityText = rooms.availability ? "Ocupada" : "Disponible";

    for (const room of rooms) {
        numberRooms += `
        <div class="room-card p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-all">
            <h2 class="room-title text-xl font-semibold text-gray-800">Habitación ${room.number}</h2>
            <h3 class="room-type text-lg text-gray-600">Tipo: ${room.type}</h3>
            <p class="room-status text-md text-gray-500">Estado: ${availabilityText}</p>
            <img class="room-image mt-4 rounded-lg w-full h-auto" src="${room.image}" alt="Imagen de la habitación">
        </div>`;
    }

    console.log(numberRooms);
    elemHTML.innerHTML = numberRooms;
}

// json-server information port
function mostrarJson(elemHTML) {
    console.log("Cargando los datos desde json-server");

    // Realizamos la solicitud al servidor
    fetch("http://localhost:3000/rooms") // URL de tu json-server
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            console.log(datos);
            roomCards(elemHTML, datos);
        })
        .catch((error) =>
            console.error("Error en la solicitud", error.message)
        )
        .finally(() => console.log("Se han cargado los datos"));
}

const final = document.getElementById("roomsDisplay");
mostrarJson(final);

