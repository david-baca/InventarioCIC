/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.jsx",
    ],
    theme: {
      extend: {
        "colors": {
         "UP-Primario": "#ec6b0c",
         "UP-Secundario": "#590100",
         "UP-Apoyo": "#faaf6c",
         "UP-Auxiliar": "#ff8702",
         "UP-Negro": "#030303",
         "UP-Gris": "#efefef",
         "UP-Blanco": "#ffffff",
         "UP-Exito": "#18c07a",
         "UP-Informacion": "#3bdded",
         "UP-Advertancia": "#ede63b",
         "UP-Error": "#dc3545",
         "UP-Opaco": "#9a9a9a"
        },
        "fontFamily": {
          "montserrat": "Montserrat",
          "roboto": "Roboto"
        },
       },
    },
    plugins: [],
  }