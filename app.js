//DOM
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

//Agregar array de productos del JSON

const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    pintarProductos(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

const contendorProductos = document.querySelector("#contenedor-productos");
const pintarProductos = (data) => {
  const template = document.querySelector("#template-productos").content;
  const fragment = document.createDocumentFragment();
  data.forEach((producto) => {
    template.querySelector("img").setAttribute("src", producto.thumbnailUrl);
    template.querySelector("h5").textContent = producto.title;
    template.querySelector("p span").textContent = producto.precio;
    template.querySelector("button").dataset.id = producto.id;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contendorProductos.appendChild(fragment);
};

let carrito = {};

// Detectar acciones del mouse

const detectarBotones = (data) => {
  const botones = document.querySelectorAll(".card button");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = data.find(
        (item) => item.id === parseInt(btn.dataset.id)
      );
      producto.cantidad = 1;
      if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }
      carrito[producto.id] = { ...producto };
      pintarCarrito();
    });
  });
};

const items = document.querySelector("#items");

const pintarCarrito = () => {
  items.innerHTML = "";

  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();

  Object.values(carrito).forEach((producto) => {
    template.querySelector("th").textContent = producto.id;
    template.querySelectorAll("td")[0].textContent = producto.title;
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    template.querySelector("span").textContent =
      producto.precio * producto.cantidad;

    //Botones
    template.querySelector(".btn-info").dataset.id = producto.id;
    template.querySelector(".btn-danger").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  pintarFooter();
  accionBotones();
};

//Carrito parte inferior

const template = document.querySelector("#template-footer").content;

const footer = document.querySelector("#footer-carrito");
const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío, elija y agregue un producto</th>
        `;
    return;
  }

  //const template = document.querySelector("#template-footer").content;
  const fragment = document.createDocumentFragment();

  // sumar cantidad y sumar totales
  nPrecio = 0;
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  template.querySelectorAll("td")[0].textContent = nCantidad;
  template.querySelector("span").textContent = nPrecio;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

//Botones de sumar y restar

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll("#items .btn-info");
  const botonesEliminar = document.querySelectorAll("#items .btn-danger");

  //Botón para sumar productos
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad++;
      carrito[btn.dataset.id] = { ...producto };
      pintarCarrito();
    });
  });

  //Botón para restar productos
  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carrito[btn.dataset.id];
      producto.cantidad--;
      if (producto.cantidad === 0) {
        delete carrito[btn.dataset.id];
      } else {
        carrito[btn.dataset.id] = { ...producto };
      }
      pintarCarrito();
    });
  });
};

// Modal

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  modal.style.display = "none";
};

// Formulario

const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");

const expresiones = {
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d{7,14}$/, // 7 a 14 numeros.
};

const campos = {
  nombre: false,
  correo: false,
  telefono: false,
};

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;
    case "correo":
      validarCampo(expresiones.correo, e.target, "correo");
      break;
    case "telefono":
      validarCampo(expresiones.telefono, e.target, "telefono");
      break;
  }
};

const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value)) {
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos[campo] = true;
  } else {
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos[campo] = false;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();



  const nNombre = document.querySelector("#IDnombre").value;
  const nCorreo = document.querySelector("#IDcorreo").value;
  const nTelefono = document.querySelector("#IDtelefono").value;

  if (campos.nombre && campos.correo && campos.telefono) {
    formulario.reset();

    document
      .getElementById("formulario__mensaje-exito")
      .classList.add("formulario__mensaje-exito-activo");
    setTimeout(() => {
      document
        .getElementById("formulario__mensaje-exito")
        .classList.remove("formulario__mensaje-exito-activo");
    }, 5000);

    document
      .querySelectorAll(".formulario__grupo-correcto")
      .forEach((icono) => {
        icono.classList.remove("formulario__grupo-correcto");
      });
    document
      .getElementById("formulario__mensaje")
      .classList.remove("formulario__mensaje-activo");

    modal.style.display = "block";
    
    let lNombre = localStorage.getItem("Nombre");
    let lCorreo = localStorage.getItem("Correo");
    let lContacto = localStorage.getItem("Telefono");
    let lConsumo = localStorage.getItem("UltimoGasto");

    document.getElementById("ModalNombre").textContent = nNombre;
    document.getElementById("ModalCorreo").textContent = nCorreo;
    document.getElementById("ModalTelefono").textContent = nTelefono;
    document.getElementById("ModalTotal").textContent = nPrecio;
    document.getElementById("uNombre").textContent = lNombre;
    document.getElementById("uCorreo").textContent = lCorreo;
    document.getElementById("uTelefono").textContent = lContacto;
    document.getElementById("uTotal").textContent = lConsumo;

    localStorage.setItem("Nombre", nNombre);
    localStorage.setItem("Correo", nCorreo);
    localStorage.setItem("Telefono", nTelefono);
    localStorage.setItem("UltimoGasto", nPrecio);
  } else {
    document
      .getElementById("formulario__mensaje")
      .classList.add("formulario__mensaje-activo");
  }
});

