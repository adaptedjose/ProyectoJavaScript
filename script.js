//Photo library functions
document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.getElementById('carrusel');
    const images = carrusel.children;
    const botonAnterior = document.getElementById('botonAnterior');
    const botonSiguiente = document.getElementById('botonSiguiente');
  
    const totalImages = images.length;
    let currentIndex = 0;
  
    const actualizarCarrusel = () => {
      const offset = -currentIndex * 100;
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
  
    setInterval(irSiguiente, 3000);
  });

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
    fetch("http://localhost:3000/rooms")
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


function handleReservationClick() {
  const user = JSON.parse(localStorage.getItem('user')); 

  if (user) {
    window.location.href = '/index_3.html';
  } else {
    openModal();
  }
}

function openModal() {
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        console.log('Usuario iniciado sesión:', user);
        closeModal(); 
        localStorage.setItem('user', JSON.stringify(user)); 
        alert(`¡Bienvenido de nuevo, ${user.username}!`); 
        window.location.href = '/index_3.html'; 
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function register() {
  const newUsername = document.getElementById('new-username').value;
  const newEmail = document.getElementById('new-email').value;
  const newPassword = document.getElementById('new-password').value;

  const user = { username: newUsername, email: newEmail, password: newPassword };

  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Usuario registrado:', data);
      closeModal(); 
      localStorage.setItem('user', JSON.stringify(data)); 
      alert(`¡Bienvenido, ${data.username}!`); 
      window.location.href = '/index_3.html'; 
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function switchToRegister() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

function switchToLogin() {
  document.getElementById('register-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}

function logout() {
  localStorage.removeItem('user');
  alert('Sesión cerrada.');
  window.location.href = '/index.html';
}

//Código de arriba listo



const apiUrl = "http://localhost:3000";  


async function loadRooms() {
  const rooms = await fetch(`${apiUrl}/rooms`).then(res => res.json());
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = ""; 

  
  const arrivalDate = document.getElementById("arrival").value;
  const departureDate = document.getElementById("departure").value;
  const numPeople = parseInt(document.getElementById("people").value, 10);

  if (!arrivalDate || !departureDate || !numPeople) {
    return; 
  }

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  const reservations = await fetch(`${apiUrl}/reservations`).then(res => res.json());

  const filteredRooms = rooms.filter(room => {
    const isAvailable = room.availability;

    const hasEnoughCapacity = room.capacity >= numPeople;

    const isAvailableOnDates = isAvailable && 
      (arrival >= new Date(room.endDate || arrivalDate)) && 
      (departure <= new Date(room.startDate || departureDate));

    const isAvailableForNewReservation = reservations.every(reservation => {
      if (reservation.roomId === room.id) {
        const reservedStart = new Date(reservation.startDate);
        const reservedEnd = new Date(reservation.endDate);
        return (departure <= reservedStart || arrival >= reservedEnd);
      }
      return true;
    });

    return isAvailableOnDates && hasEnoughCapacity && isAvailableForNewReservation;
  });

  if (filteredRooms.length === 0) {
    roomsContainer.innerHTML = `<p class="text-center text-gray-500">No hay habitaciones disponibles según los criterios</p>`;
    return;
  }

  filteredRooms.forEach(room => {
    const roomElement = createRoomElement(room);
    roomsContainer.appendChild(roomElement);
  });
}

function createRoomElement(room) {
  const roomElement = document.createElement("div");
  roomElement.className = "bg-white p-6 rounded-lg shadow-md mb-4";
  roomElement.innerHTML = `
    <p><strong>Habitación:</strong> ${room.number}</p>
    <p><strong>Tipo:</strong> ${room.type}</p>
    <p><strong>Capacidad:</strong> ${room.capacity} personas</p>
    <p><strong>Disponible:</strong> ${room.availability ? "Sí" : "No"}</p>
    <button data-id="${room.id}" class="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 ${!room.availability ? 'cursor-not-allowed opacity-50' : ''}">
      Reservar
    </button>
  `;
  roomElement.querySelector("button").addEventListener("click", () => reserveRoom(room.id));
  return roomElement;
}

document.getElementById("filter-form").addEventListener("submit", (e) => {
  e.preventDefault();
  loadRooms();
});

async function loadReservations() {
  try {
    const reservations = await fetch(`${apiUrl}/reservations`).then(res => res.json());

    const reservationsContainer = document.getElementById("reservations-container");
    reservationsContainer.innerHTML = "";

    if (reservations.length === 0) {
      reservationsContainer.innerHTML = `<p class="text-center text-gray-500">No tienes reservas activas</p>`;
      return;
    }

    reservations.forEach(reservation => {
      const reservationElement = document.createElement("div");
      reservationElement.className = "bg-white p-6 rounded-lg shadow-md mb-4";
      reservationElement.innerHTML = `
        <p><strong>Habitación:</strong> ${reservation.roomId}</p>
        <p><strong>Fecha de llegada:</strong> ${reservation.startDate}</p>
        <p><strong>Fecha de salida:</strong> ${reservation.endDate}</p>
        <button data-id="${reservation.id}" data-room="${reservation.roomId}" class="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600">
          Cancelar reserva
        </button>
      `;
      reservationElement.querySelector("button").addEventListener("click", (e) => {
        const reservationId = e.target.dataset.id;
        const roomId = e.target.dataset.room;
        cancelReservation(reservationId, roomId);
      });
      reservationsContainer.appendChild(reservationElement);
    });
  } catch (error) {
    console.error("Error al cargar las reservas:", error);
  }
}

async function cancelReservation(reservationId, roomId) {
  try {
    await fetch(`${apiUrl}/reservations/${reservationId}`, {
      method: "DELETE"
    });

    await fetch(`${apiUrl}/rooms/${roomId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ availability: true })
    });

    loadReservations();
    loadRooms();

  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
  }
}

async function reserveRoom(roomId) {
  const startDate = document.getElementById("arrival").value;
  const endDate = document.getElementById("departure").value;

  if (!startDate || !endDate) {
    alert("Por favor, selecciona una fecha de llegada y salida.");
    return;
  }

  const reservation = {
    roomId,
    startDate,
    endDate
  };

  await fetch(`${apiUrl}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reservation)
  });

  await fetch(`${apiUrl}/rooms/${roomId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ availability: false })
  });

  loadReservations();
  loadRooms();
}

loadReservations(); 


