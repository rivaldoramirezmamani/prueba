// Agrega esto al inicio para ver errores en consola
const supabaseUrl = "https://ripihhubodzzkcjvoihh.supabase.co";
const supabaseKey = "sb_publishable_ZKaLrYHn9Mw2OkMNP62OLw_iGhHdz8_";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Verificar conexión
async function verificarConexion() {
  console.log("Verificando conexión con Supabase...");
  
  const { data, error } = await supabase
    .from('productos')
    .select('count')
    .limit(1);
    
  if (error) {
    console.error("❌ Error de conexión:", error);
    alert("Error de conexión: " + error.message);
    return false;
  }
  
  console.log("✅ Conexión exitosa");
  return true;
}

// READ (Modificado para mejor depuración)
async function listarProductos() {
  console.log("Cargando productos...");
  
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  const tabla = document.getElementById("tablaProductos");
  
  if (error) {
    console.error("Error al cargar productos:", error);
    tabla.innerHTML = `
      <tr>
        <td colspan="3" style="color: red;">
          Error: ${error.message}<br>
          <small>Verifica las políticas RLS en Supabase</small>
        </td>
      </tr>`;
    return;
  }

  console.log("Productos recibidos:", data);
  
  if (data.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="3">
          No hay productos registrados.
          <br><small>Agrega uno usando el formulario arriba</small>
        </td>
      </tr>`;
    return;
  }

  tabla.innerHTML = "";
  data.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.nombre || 'Sin nombre'}</td>
      <td>${p.precio || '0'}</td>
      <td>
        <button onclick="editarProducto(${p.id}, '${p.nombre}', ${p.precio})">Editar</button>
        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(row);
  });
}

// CREATE
async function crearProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);

  if (!nombre || isNaN(precio)) {
    alert("Completa todos los campos correctamente");
    return;
  }

  const { error } = await supabase
    .from("productos")
    .insert([{ nombre, precio }]);

  if (error) {
    alert("Error al guardar: " + error.message);
  } else {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    listarProductos();
  }
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', async function() {
  await verificarConexion();
  await listarProductos();
});

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', async function() {
  await verificarConexion();
  await listarProductos();
});
