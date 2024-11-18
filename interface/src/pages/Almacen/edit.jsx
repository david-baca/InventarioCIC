import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewStoreEdit = () => {
  return (
    <div className="h-[1224px] flex-col justify-start items-start inline-flex">
      {/* Header */}
      <div className="self-stretch h-[62px] p-5 bg-[#590100] shadow justify-between items-center inline-flex">
        <div className="text-white text-3xl font-semibold font-['Montserrat']">Bienvenido Fernando Castillo</div>
        <div className="text-white text-[25px] font-medium font-['Roboto']">Cerrar Sesion</div>
      </div>

      {/* Main Content */}
      <div className="self-stretch h-[1098px] px-[50px] pt-[50px] flex-col justify-start items-center gap-[35px] flex">
        
        {/* Title Section */}
        <div className="self-stretch h-[91px] flex-col justify-start items-start gap-9 flex">
          <div className="self-stretch px-[50px] py-6 bg-[#590100] justify-center items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 self-stretch text-white text-[35px] font-bold font-['Montserrat']">
              Editar el Area
            </div>
          </div>
        </div>

        {/* Area Details Section */}
        <div className="self-stretch h-[1302px] flex-col justify-start items-start gap-[35px] flex">
          {/* Article Area Title */}
          <div className="w-[1078px] h-[82px] justify-center items-center gap-9 inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Articulos del Area</div>
              <div className="self-stretch text-[#030303] text-[25px] font-normal font-['Roboto']">Rellene todos los campos para poder dar de alta un area</div>
            </div>
          </div>

          {/* Area Item - Description */}
          <div className="self-stretch h-[77px] p-4 bg-[#efefef] rounded-xl border border-[#590100] justify-start items-center inline-flex">
            <div className="grow shrink basis-0 h-[23px] justify-start items-center gap-2.5 flex">
              <div className="w-[328px] text-[#030303] text-xl font-normal font-['Roboto']">Computadora HP completa</div>
            </div>
            <div className="bg-[#efefef] justify-center items-center flex">
              <div className="text-[#4e2016] text-xl font-normal font-['Roboto']">Nombre del Area</div>
            </div>
          </div>

          {/* Area Description */}
          <div className="self-stretch h-[150px] p-4 bg-[#efefef] rounded-xl border border-[#590100] justify-center items-center inline-flex">
            <div className="bg-[#efefef] justify-center items-center flex">
              <div className="text-[#4e2016] text-xl font-normal font-['Roboto']">Descripcion</div>
            </div>
            <div className="justify-center items-center flex">
              <div className="text-[#030303] text-xl font-normal font-['Roboto']">Este es un Area de computadora HP integrada a con pantalla only one, teclado y mause.</div>
            </div>
          </div>

          {/* Inventory Items Section */}
          <div className="self-stretch h-[93px] justify-center items-center gap-9 inline-flex">
            <div className="flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch text-[#030303] text-3xl font-semibold font-['Montserrat']">Articulos del inventario</div>
              <div className="self-stretch text-[#030303] text-[25px] font-normal font-['Roboto']">Selecciona por lo menos 2 articulos para asignarlos a el Area</div>
            </div>
            <div className="grow shrink basis-0 self-stretch p-4 justify-end items-center gap-4 flex">
              <div className="grow shrink basis-0 h-[55px] p-4 bg-white rounded-2xl border border-[#9a9a9a] justify-between items-center flex">
                <div className="h-[23px] justify-start items-center gap-2.5 flex">
                  <div className="text-[#030303] text-xl font-normal font-['Roboto']">Buscar</div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory List */}
          <div className="self-stretch h-[298px] flex-col justify-center items-center flex">
            <div className="self-stretch justify-center items-center inline-flex">
              <div className="grow shrink basis-0 border border-[#4d4d4d] flex-col justify-center items-center inline-flex">
                <div className="self-stretch h-[54px] p-4 bg-[#590100] border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-white text-xl font-normal font-['Roboto']">Nombre</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">Oculus quest 2</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">Teclado</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">Mause</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">Monitor only one</div>
                </div>
              </div>

              {/* Token Section */}
              <div className="grow shrink basis-0 border border-[#4d4d4d] flex-col justify-center items-center inline-flex">
                <div className="self-stretch h-[54px] p-4 bg-[#590100] border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-white text-xl font-normal font-['Roboto']">Token</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">UPQROO-2021-HJUP</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">UPQROO-2021-AJUP</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">UPQROO-2021-BJUP</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">UPQROO-2021-CJUP</div>
                </div>
              </div>

              {/* Total Section */}
              <div className="grow shrink basis-0 border border-[#4d4d4d] flex-col justify-center items-center inline-flex">
                <div className="self-stretch h-[54px] p-4 bg-[#590100] border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-white text-xl font-normal font-['Roboto']">Total</div>
                </div>
                <div className="self-stretch h-[61px] p-4 border border-[#9a9a9a] justify-center items-center inline-flex">
                  <div className="grow shrink basis-0 text-center text-[#9a9a9a] text-xl font-normal font-['Roboto']">$10,500.00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="self-stretch flex-col justify-center items-center gap-2.5 flex">
            <div className="self-stretch justify-center items-center inline-flex">
              <div className="h-[80px] w-[300px] bg-[#590100] border border-[#9a9a9a] justify-center items-center inline-flex">
                <div className="text-white text-2xl font-normal font-['Roboto']">Guardar cambios</div>
              </div>
            </div>
            <div className="self-stretch justify-center items-center inline-flex">
              <div className="h-[80px] w-[300px] bg-[#efefef] border border-[#9a9a9a] justify-center items-center inline-flex">
                <div className="text-[#9a9a9a] text-2xl font-normal font-['Roboto']">Cancelar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStoreEdit;
