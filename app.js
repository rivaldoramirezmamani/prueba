// Configuración de Supabase
const SUPABASE_URL = 'https://ripihubodzkcjvoihh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZKaLrYHn9Mw2OkMNP62OLw_iGhHdz8_';

// Función para hacer peticiones a Supabase
async function supabaseRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
    
    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

// Función para cargar productos
async function cargarProductos() {
    const loadingDiv = document.getElementById('loading');
    const productosDiv = document.getElementById('productos');
    
    try {
        loadingDiv.style.display = 'block';
        productosDiv.innerHTML = '';

        const productos = await supabaseRequest('productos?select=*');

        loadingDiv.style.display = 'none';

        if (productos.length === 0) {
            productosDiv.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2em;">No hay productos disponibles</p>';
            return;
        }

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            card.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p class="precio">$${parseFloat(producto.precio).toFixed(2)}</p>
            `;
            productosDiv.appendChild(card);
        });

    } catch (error) {
        loadingDiv.style.display = 'none';
        mostrarMensaje(`Error al cargar productos: ${error.message}`, 'error');
        console.error('Error:', error);
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'success') {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.className = tipo;
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

// Función para guardar producto
async function guardarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);

    try {
        const nuevoProducto = {
            nombre: nombre,
            precio: precio
        };

        await supabaseRequest('productos', 'POST', nuevoProducto);

        mostrarMensaje('¡Producto guardado exitosamente!', 'success');
        
        document.getElementById('productoForm').reset();
        
        cargarProductos();

    } catch (error) {
        mostrarMensaje(`Error al guardar producto: ${error.message}`, 'error');
        console.error('Error:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
    const form = document.getElementById('productoForm');
    form.addEventListener('submit', guardarProducto);
});
