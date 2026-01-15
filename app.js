// 🔹 Datos de Supabase
const supabaseUrl = "https://ripihhubodzzkcjvoihh.supabase.co";
const supabaseKey = "sb_publishable_ZKaLrYHn9Mw2OkMNP62OLw_iGhHdz8_";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// 🔹 CREATE
async function crearProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;

  if (!nombre || !precio || !stock) {
    alert("Completa todos los campos");
    return;
  }

  const { error } = await supabase
    .from("productos")
    .insert([{ nombre, precio, stock }]);

  if (error) {
    alert("Error: " + error.message);
  } else {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    listarProductos();
  }
}

// 🔹 READ
async function listarProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  if (error) {
    tabla.innerHTML = "<tr><td colspan='4'>Error al cargar</td></tr>";
    return;
  }

  data.forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.precio}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick="editarProducto(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock})">Editar</button>
          <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// 🔹 UPDATE
async function editarProducto(id, nombre, precio, stock) {
  const nuevoNombre = prompt("Nombre:", nombre);
  const nuevoPrecio = prompt("Precio:", precio);
  const nuevoStock = prompt("Stock:", stock);

  if (!nuevoNombre || !nuevoPrecio || !nuevoStock) return;

  await supabase
    .from("productos")
    .update({
      nombre: nuevoNombre,
      precio: nuevoPrecio,
      stock: nuevoStock
    })
    .eq("id", id);

  listarProductos();
}

// 🔹 DELETE
async function eliminarProducto(id) {
  if (!confirm("¿Eliminar producto?")) return;

  await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  listarProductos();
}

// 🔹 Cargar al iniciar
listarProductos();
