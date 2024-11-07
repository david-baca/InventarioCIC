import React from 'react';

const success= ({ mensaje, action }) => {
    // Si isview es true, mostramos la ventana emergente. Si no, no mostramos nada.
    return (
        mensaje && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
            <div className="flex flex-col max-w-2xl max-h-full rounded-lg overflow-hidden w-[50%] pt-12 bg-UP-Exito">
            <div className="bg-UP-Blanco p-2 flex flex-col">
                <h1 className="py-6 text-center">
                    {mensaje}
                </h1>
                <button onClick={action} className="text-white bg-UP-Opaco hover:bg-UP-Auxiliar font-medium rounded-lg px-2 py-1 text-center font-roboto uppercase transition-all duration-300 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rounded-md hover:shadow-[4px_4px_0px_] hover:shadow-UP-Opaco">
                    Enterado
                </button>
            </div>
            </div>
        </div>
        )
    );
};
const info = ({ mensaje, action }) => {
    // Si isview es true, mostramos la ventana emergente. Si no, no mostramos nada.
    return (
        mensaje && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
            <div className="flex flex-col max-w-2xl max-h-full rounded-lg overflow-hidden w-[50%] pt-12 bg-UP-Informacion">
            <div className="bg-UP-Blanco p-2 flex flex-col">
                <h1 className="py-6 text-center">
                    {mensaje}
                </h1>
                <button onClick={action} className="text-white bg-UP-Opaco hover:bg-UP-Auxiliar font-medium rounded-lg px-2 py-1 text-center font-roboto uppercase transition-all duration-300 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rounded-md hover:shadow-[4px_4px_0px_] hover:shadow-UP-Opaco">
                    Enterado
                </button>
            </div>
            </div>
        </div>
        )
    );
};
const alert= ({ mensaje, action }) => {
    // Si isview es true, mostramos la ventana emergente. Si no, no mostramos nada.
    return (
        mensaje && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
            <div className="flex flex-col max-w-2xl max-h-full rounded-lg overflow-hidden w-[50%] pt-12 bg-UP-Advertancia">
            <div className="bg-UP-Blanco p-2 flex flex-col">
                <h1 className="py-6 text-center">
                    {mensaje}
                </h1>
                <button onClick={action} className="text-white bg-UP-Opaco hover:bg-UP-Auxiliar font-medium rounded-lg px-2 py-1 text-center font-roboto uppercase transition-all duration-300 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rounded-md hover:shadow-[4px_4px_0px_] hover:shadow-UP-Opaco">
                    Enterado
                </button>
            </div>
            </div>
        </div>
        )
    );
};
const error= ({ mensaje, action }) => {
    // Si isview es true, mostramos la ventana emergente. Si no, no mostramos nada.
    return (
        mensaje && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-25 flex justify-center items-center">
            <div className="flex flex-col max-w-2xl max-h-full rounded-lg overflow-hidden w-[50%] pt-12 bg-UP-Error">
            <div className="bg-UP-Blanco p-2 flex flex-col">
                <h1 className="py-6 text-center">
                    {mensaje}
                </h1>
                <button onClick={action} className="text-white bg-UP-Opaco hover:bg-UP-Auxiliar font-medium rounded-lg px-2 py-1 text-center font-roboto uppercase transition-all duration-300 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:rounded-md hover:shadow-[4px_4px_0px_] hover:shadow-UP-Opaco">
                    Enterado
                </button>
            </div>
            </div>
        </div>
        )
    );
};
export default {success, alert, error, info}