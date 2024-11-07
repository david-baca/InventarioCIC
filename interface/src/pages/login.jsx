import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Botones from '../components/botones';
import Buscador from '../components/buscador';

const ViewLogin = () => {
  return (
    <>
      <div className="bg-gray-900 flex">
        <h1 class='bg-red-600'>hola</h1>
        <Botones.botonContinuar text={'Continuar'}/>
        <Botones.botonConfirmarVerde text={'onfimo'}/>
        <Botones.botonConfirmarRojo text={'onfimo'}/>
        <Botones.botonCancelar text={'Cancelar'}/>
        <Botones.botonCrear/>
        <Botones.botonImprimir/>
        <Buscador.buscador/>
        <CajaDeTexto.cajaDeTexto/>
      </div>
    </>
  );
};
export default ViewLogin;