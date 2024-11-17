import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TarjetaSoloTitulo from "../../components/TarjetaSoloTitulo";
import TarjetaTituloContenido from "../../components/TarjetaTituloContenido";

const ViewStoreLoad = () => {
  // Estado para el nombre del área y la descripción
  const [nombreArea, setNombreArea] = useState('');
  const [descripcionArea, setDescripcionArea] = useState('');
  
  // Función para manejar el cambio en los campos de texto
  const handleNombreAreaChange = (e) => {
    setNombreArea(e.target.value);
  };

  const handleDescripcionAreaChange = (e) => {
    setDescripcionArea(e.target.value);
  };

  // Función para guardar los datos
  const handleSave = async () => {
    if (!nombreArea || !descripcionArea) {
      alert("Por favor, rellene todos los campos.");
      return;
    }

    try {
      // Ejemplo de llamada a un backend con axios (debes configurar la URL de tu API)
      await axios.post('/api/guardar-area', {
        nombre: nombreArea,
        descripcion: descripcionArea
      });
      alert("Área guardada exitosamente");
    } catch (error) {
      alert("Hubo un error al guardar el área");
      console.error(error);
    }
  };

  return (
    <div className="h-[1266px] flex-col justify-start items-start inline-flex">
      <div className="self-stretch h-[62px] p-5 bg-[#590100] shadow justify-between items-center inline-flex">
        <div className="text-white text-3xl font-semibold font-['Montserrat']">
          Bienvenido Fernando Castillo
        </div>
        <div className="text-white text-[25px] font-medium font-['Roboto']">Cerrar Sesion</div>
      </div>
      <div className="self-stretch grow shrink basis-0 px-[50px] pt-[50px] flex-col justify-start items-center gap-[35px] flex">
        <div className="self-stretch h-[91px] justify-start items-start gap-9 flex">
          <div className="self-stretch px-[50px] py-6 bg-[#590100] justify-center items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 self-stretch text-white text-[35px] font-bold font-['Montserrat']">
              Alta de Area
            </div>
          </div>
        </div>
        <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-[35px] flex">
          <div className="w-[1078px] h-[82px] justify-center items-center gap-9 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Articulos del Area</div>
              <div className="self-stretch text-[#030303] text-[25px] font-normal font-['Roboto']">Rellene todos los campos para poder registrar el Area</div>
            </div>
          </div>

          {/* Componente para el nombre del área */}
          <TarjetaSoloTitulo 
            titulo={nombreArea}
            onChange={handleNombreAreaChange}
          />

          {/* Componente para la descripción del área */}
          <TarjetaTituloContenido 
            titulo="Descripción del Área" 
            contenido={descripcionArea}
            onChange={handleDescripcionAreaChange}
          />

          {/* Otros campos y componentes */}
          <div className="self-stretch h-[201px] justify-center items-center gap-9 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Articulos del inventario</div>
              <div className="self-stretch text-[#030303] text-[25px] font-normal font-['Roboto']">Selecciona por lo menos 2 articulos para asignarlos a el area</div>
            </div>
            <div className="grow shrink basis-0 self-stretch p-4 justify-end items-center gap-4 flex">
              <div className="h-[55px] p-4 bg-white rounded-2xl border border-[#9a9a9a] justify-between items-center flex">
                <div className="h-[23px] justify-start items-center gap-2.5 flex">
                  <div className="text-[#030303] text-xl font-normal font-['Roboto']">Buscar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="self-stretch h-[54px] justify-center items-center gap-9 inline-flex">
          <div className="grow shrink basis-0 justify-center items-center gap-2.5 inline-flex">
            <div 
              className="h-[54px] w-[410px] p-4 bg-[#590100] rounded-[100px] justify-center items-center inline-flex"
              onClick={handleSave}
            >
              <div className="text-white text-[20px] font-medium font-['Roboto']">Guardar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStoreLoad;
