const KEY_CREDENTIAL = import.meta.env.VITE_BASE_API
// Función para guardar las credenciales en localStorage
export const saveToLocalStorage = (credencial) => {
  console.log(credencial)
  if (credencial && typeof credencial === 'object') {
    try {
      // Convierte el objeto de credenciales a una cadena JSON antes de almacenarlo
      localStorage.setItem(KEY_CREDENTIAL, JSON.stringify(credencial));
    } catch (error) {
      console.error("Error al guardar en localStorage", error);
    }
  } else {
    console.error("Credencial no válida:", credencial);
  }
};

// Función para obtener las credenciales desde localStorage
export const getFromLocalStorage = () => {
  try {
    const credencialString = localStorage.getItem(KEY_CREDENTIAL);
    return credencialString ? JSON.parse(credencialString) : null;
  } catch (error) {
    console.error("Error al obtener datos de localStorage", error);
    return null;
  }
};

// Función para limpiar las credenciales desde localStorage
export const clearFromLocalStorage = () => {
  try {
    localStorage.removeItem(KEY_CREDENTIAL);
  } catch (error) {
    console.error("Error al limpiar datos de localStorage", error);
  }
};
