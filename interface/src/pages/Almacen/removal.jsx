import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Botones from '../../components/Botones'; 
import TarjetaTituloContenido from '../../components/TarjetaTituloContenido'; 

const peticion = () => {
  const section = "almacen";  
  const baseApi = import.meta.env.VITE_BASE_API;
  const instance = axios.create({
    baseURL: baseApi,
  });

  const ObtenerDetalles = async (id_almacen) => {
    try {
      const response = await instance.get(`/${section}/details/${id_almacen}`);
      return response.data; // Assumes response.data contains the store details
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  const EliminarAlmacen = async (id) => {
    try {
      const response = await instance.delete(`/${section}/${id}`);
      return response.data; // Assumes response.data contains a success message
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'Error in API interaction');
    }
  };

  return { ObtenerDetalles, EliminarAlmacen };
};

const ViewStoreRemoval = () => {
  const navigate = useNavigate();
  const { pk } = useParams();
  const Peticion = peticion();
  
  const [almacen, setAlmacen] = useState(null);
  const [error, setError] = useState(null);
  const [motivoBaja, setMotivoBaja] = useState(''); 

  useEffect(() => {
    const cargarAlmacen = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setAlmacen(result.almacen); // Assumes response contains 'almacen'
      } catch (err) {
        setError(err.message);
      }
    };
    
    cargarAlmacen();
  }, [pk]);

  const handleDelete = async () => {
    if (almacen.responsable) {
      setError('No se puede dar de baja un Area asociado a un responsable.');
      return;
    }

    try {
      await Peticion.EliminarAlmacen(almacen.pk); // Assumes almacen has a 'pk' field
      navigate('/almacen'); // Redirect to the storage list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirm = () => {
    console.log('Confirmado');
    handleDelete();
  };

  const handleCancel = () => {
    console.log('Cancelado');
    navigate('/almacen');
  };

  const handleMotivoChange = (e) => {
    setMotivoBaja(e.target.value); 
  };

  return (
    <>
      <div className="h-[984px] flex-col justify-start items-start inline-flex">
      

        <div className="self-stretch grow shrink basis-0 p-[50px] flex-col justify-start items-center gap-[35px] flex">
          
          
          <div className="self-stretch h-[91px] flex-col justify-start items-start gap-9 flex">
            <div className="self-stretch px-[50px] py-6 bg-[#590100] justify-center items-center gap-2.5 inline-flex">
              <div className="grow shrink basis-0 self-stretch text-white text-[35px] font-bold font-['Montserrat']">
                Dar de baja un area.
              </div>
            </div>
          </div>

          
          <div className="self-stretch justify-center items-center gap-9 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Motivo de baja</div>
              <div className="self-stretch text-[#030303] text-[25px] font-normal font-['Roboto']">
                Los motivos de baja son campos para comentar el porqué se suspende un area.
              </div>
            </div>
          </div>

          
          <div className="w-full max-w-[1150px] mx-auto">
            <textarea
              value={motivoBaja}
              onChange={handleMotivoChange}
              rows="4"
              className="w-full bg-[#efefef] border border-[#590100] p-2 text-[#4e2016] text-xl font-normal font-['Roboto'] rounded-xl pl-4 pt-4 focus:outline-none focus:ring-2 focus:ring-[#590100]"
              placeholder="Escribe aquí el motivo de baja"
            />
          </div>


         
          <div className="self-stretch flex gap-4">
  <button 
    onClick={handleCancel} 
    className="bg-transparent border-2 border-black text-black w-full py-3 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:text-black"
  >
    Cancelar
  </button>
   
   <button 
    onClick={handleConfirm} 
    disabled={!motivoBaja} 
    className={`font-bold py-3 px-4 rounded-lg w-full ${motivoBaja ? "bg-UP-Error text-white hover:bg-red-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
  >
    Confirmar
  </button>
</div>


        
          <div className="self-stretch justify-center items-center gap-9 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Baja de un Area</div>
              <div className="self-stretch">
                <span className="text-[#030303] text-xl font-normal font-['Roboto']">Yo, </span>
                <span className="text-[#030303] text-[25px] font-normal font-['Roboto']">Fernando Castillo</span>
                <span className="text-[#030303] text-xl font-normal font-['Roboto']">, en mi calidad de </span>
                <span className="text-[#030303] text-[25px] font-normal font-['Roboto']">Administrador</span>
                <span className="text-[#030303] text-xl font-normal font-['Roboto']">, declaro que en fecha </span>
                <span className="text-[#030303] text-[25px] font-normal font-['Roboto']">30/09/2024</span>
                <span className="text-[#030303] text-xl font-normal font-['Roboto']">
                  {" "}se procede a dar de baja el área Almacén de Computadoras. Esta decisión se toma debido a {motivoBaja}, lo que impide su seguimiento en esta institución.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ViewStoreRemoval;
