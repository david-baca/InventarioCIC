import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { signInWithPopup, auth, provider } from './firebase';
import { Link } from 'react-router-dom';
import Logo from "../../public/img/upqroo.png"

const ViewLogin = () => {

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     const email = user.email;

  //     // Verifica el correo en la base de datos (esta mal, hay que ajustarlo a la api)
  //     const response = await axios.post('/api/verificarCorreo', { email });

  //     if (response.data.registrado) {
  //       alert('Inicio de sesión exitoso');
  //       // Redirige al usuario a la página principal o panel
  //     } else {
  //       alert('Correo no registrado en el sistema');
  //       // Opcional: Redirige a una página de registro o muestra un mensaje
  //     }
  //   } catch (error) {
  //     console.error('Error en la autenticación con Google:', error);
  //     alert('Hubo un error al iniciar sesión');
  //   }
  // };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('http://servicios.upqroo.edu.mx/estanciasestadias/public/assets/images/LogoCafe.jpg')" }}>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-2">Inventarios CIC</h2>
        <img src={Logo}/>
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
        <p className="text-gray-500 mb-6">Con cuenta institucional (@upqroo.edu.mx)</p>
        
        
        <button className="flex items-center justify-center w-full border border-gray-400 py-2 rounded-full hover:bg-gray-100 transition"
        // onClick={handleGoogleLogin}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">Google</span>
        </button>


        <Link to="./coordinadores">
          <button className="flex items-center justify-center w-full border border-gray-400 py-2 rounded-full hover:bg-gray-100 transition">
          <span className="text-gray-700 font-medium">Boton por mientras </span>
            <img src="https://i.pinimg.com/originals/36/69/82/36698270a51a0c4129847dbfca2e068b.gif"
              className="w-5 h-5 mr-2"/>            
          </button>
        </Link>
      </div>
    </div>
    </>
  );
};
export default ViewLogin;