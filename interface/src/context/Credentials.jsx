const KEY_CREDENTIAL=import.meta.env.VITE_BASE_API

// Función para guardar las credenciales en localStorage
export const saveToLocalStorage = (credencial) => {
  console.log(KEY_CREDENTIAL + ' ' + credencial)
  // Convierte el objeto de credenciales a una cadena JSON antes de almacenarlo
  localStorage.setItem(KEY_CREDENTIAL, JSON.stringify(credencial));
};

// Función para obtener las credenciales desde localStorage
export const getFromLocalStorage = () => {
  // Obtiene la cadena JSON desde localStorage y la convierte de nuevo a un objeto
  const credencialString = localStorage.getItem(KEY_CREDENTIAL);
  return credencialString ? JSON.parse(credencialString) : null;
};

// Función para limpiar las credenciales desde localStorage
export const clearFromLocalStorage = () => {
  localStorage.removeItem(KEY_CREDENTIAL);
};