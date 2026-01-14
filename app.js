const supabaseUrl = "https://ripihhubodzzkcjvoihh.supabase.co";
const supabaseKey = "sb_publishable_ZKaLrYHn9Mw2OkMNP62OLw_iGhHdz8_";

const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey);

// LOGIN
async function login() {
  const email = email.value;
  const password = password.value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) alert(error.message);
  else cargarProductos();
}

// REGISTRO
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) alert(error.message);
  else alert("Usuario registrado");
}

// LOGOUT
async function logout() {
  await supabase.auth.signOut();
  document.getElementById("productos").innerHTML = "";
}

// CARGAR PRODUCTOS
async function cargarProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    alert(error.message);
    return;
  }

  const lista = document.getElementById("productos");
  lista.innerHTML = "";

  data.forEach(p => {
    lista.innerHTML += `<li>${p.nombre} - Bs ${p.precio}</li>`;
  });
}
