import React from 'react';
import Picturi from '../../public//img/picturi.svg';
import XIcon from '../../public//img/X.svg';

const text = ({ Value, Onchange, Placeholder }) => {
  return (
    <div className="rounded p-1 relative flex border border-UP-Secundario w-[100%]" data-twe-input-wrapper-init data-twe-input-group-ref>
      <input
        type="text"
        required
        value={Value}
        onChange={(e) => Onchange(e.target.value)}  // Asegúrate de usar onChange correctamente
        className="peer w-full rounded border-0 bg-transparent 
        p-1 outline-none transition-all duration-200 ease-linear 
        focus:placeholder:opacity-100 peer-focus:text-primary 
        data-[twe-input-state-active]:placeholder:opacity-100 
        motion-reduce:transition-none dark:text-UP-Negro
        dark:placeholder:text-transparent
        dark:autofill:shadow-autofill dark:peer-focus:text-primary 
        [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0 relative"
      />
      <label
        className={`pointer-events-none absolute top-2 left-3
            ${Value === "" ? '' : '-translate-y-6 -translate-x-2'} 
            truncate text-UP-Negro 
            transition-all duration-200 ease-out 
            dark:text-UP-Secundario bg-UP-Blanco min-w-[1rem]`}
      >
        <h1>{Placeholder}</h1>
      </label>
    </div>
  );
};

const correo = ({ Value, Onchange, Placeholder }) => {
  return (
    <div className="rounded p-1 relative flex border border-UP-Secundario w-[100%]" data-twe-input-wrapper-init data-twe-input-group-ref>
      <input
        type="email"
        required
        value={Value}
        onChange={(e) => Onchange(e.target.value)}  // Asegúrate de usar onChange correctamente
        className="peer w-full rounded border-0 bg-transparent 
        p-1 outline-none transition-all duration-200 ease-linear 
        focus:placeholder:opacity-100 peer-focus:text-primary 
        data-[twe-input-state-active]:placeholder:opacity-100 
        motion-reduce:transition-none dark:text-UP-Negro
        dark:placeholder:text-transparent
        dark:autofill:shadow-autofill dark:peer-focus:text-primary 
        [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0 relative"
      />
      <label
        className={`pointer-events-none absolute top-2 left-3
            ${Value === "" ? '' : '-translate-y-6 -translate-x-2'} 
            truncate text-UP-Negro 
            transition-all duration-200 ease-out 
            dark:text-UP-Secundario bg-UP-Blanco min-w-[1rem]`}
      >
        <h1>{Placeholder}</h1>
      </label>
    </div>
  );
};

const area = ({ Value, Onchange, Placeholder }) => {
  return (
    <div className="rounded p-1 relative flex border border-UP-Secundario w-[100%]" data-twe-input-wrapper-init data-twe-input-group-ref>
      <textarea
        value={Value}
        required
        onChange={(e) => Onchange(e.target.value)}  // Asegúrate de usar onChange correctamente
        className="peer w-full rounded border-0 bg-transparent 
        p-1 outline-none transition-all duration-200 ease-linear 
        focus:placeholder:opacity-100 peer-focus:text-primary 
        data-[twe-input-state-active]:placeholder:opacity-100 
        motion-reduce:transition-none dark:text-UP-Negro
        dark:placeholder:text-transparent
        dark:autofill:shadow-autofill dark:peer-focus:text-primary 
        [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0 relative"
        rows="4"  
      />
      <label
        className={`pointer-events-none absolute top-2 left-3
            ${Value === "" ? '' : '-translate-y-6 -translate-x-2'} 
            truncate text-UP-Negro 
            transition-all duration-200 ease-out 
            dark:text-UP-Secundario bg-UP-Blanco min-w-[1rem]`}
      >
        <h1>{Placeholder}</h1>
      </label>
    </div>
  );
};

const number = ({ Value, Onchange, Placeholder }) => {
  return (
    <div className="rounded p-1 relative flex border border-UP-Secundario w-[100%]" data-twe-input-wrapper-init data-twe-input-group-ref>
      <input
        type="number"  // El tipo sigue siendo "number"
        required
        value={Value}
        onChange={(e) => Onchange(e.target.value)}  // Actualiza el valor al cambiar
        min="0.01"  // Asegura que el número sea mayor a 0
        step="0.01"  // Permite decimales (por ejemplo, 0.01)
        className="peer w-full rounded border-0 bg-transparent 
        p-1 outline-none transition-all duration-200 ease-linear 
        focus:placeholder:opacity-100 peer-focus:text-primary 
        data-[twe-input-state-active]:placeholder:opacity-100 
        motion-reduce:transition-none dark:text-UP-Negro
        dark:placeholder:text-transparent
        dark:autofill:shadow-autofill dark:peer-focus:text-primary 
        [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0 relative"
      />
      <label
        className={`pointer-events-none absolute top-2 left-3
            ${Value === "" ? '' : '-translate-y-6 -translate-x-2'} 
            truncate text-UP-Negro 
            transition-all duration-200 ease-out 
            dark:text-UP-Secundario bg-UP-Blanco min-w-[1rem]`}
      >
        <h1>{Placeholder}</h1>
      </label>
    </div>
  );
};

const checkbox = ({ Value, Onchange }) => {
  return (
      <input
        type="checkbox"  
        checked={Value}  
        onChange={() => Onchange(prev => !prev)}  
        className="p-5 accent-UP-Primario focus:ring-orange-300
        md:w-6 md:h-6 w-12 h-12" 
      />
  );
};

const fileimg = ({ object, request, ImageUpload, clikObjectDelete, clikRequestDelete }) => {
  const baseApi = import.meta.env.VITE_BASE_API;
  return (
    <div className="flex-col justify-start items-start gap-4 inline-flex">
      {/* Input para cargar nuevas imágenes */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={ImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="self-stretch p-4 bg-[#efefef] rounded-xl border border-dashed border-[#590100] justify-center items-center inline-flex cursor-pointer"
      >
        <div className="bg-[#efefef] flex-col justify-center items-center gap-4 inline-flex">
          <div className="w-[60px] h-[60px] justify-center items-center inline-flex">
            <img src={Picturi} className="w-[40px]" alt="Icono de carga" />
          </div>
          <div className="text-[#ec6b0c] text-xl font-normal font-['Roboto']">
          Arrastra tu imagen aquí { (request?.length ?? 0) + (object?.length ?? 0) } / 5
          </div>
        </div>
      </label>

      <div className="flex flex-col gap-2 w-[100%]">
        {/* Mostrar las imágenes cargadas desde el servidor (request) */}
        {request?.length > 0 && request.map((image, index) => (
          <div key={image.pk} className="self-stretch h-[55px] p-4 rounded-2xl border border-[#590100] justify-between items-center inline-flex w-[100%]">
            <div className="flex flex-row items-center text-[#030303] text-xl font-normal font-['Roboto']">
              <img
                src={baseApi+image.imagen}
                alt={`Imagen Cargada ${index}`}
                className="w-10 h-10 rounded object-cover mr-2"
              />
              {'Imagen Cargada ' + (index + 1)}
            </div>
            <button
              onClick={() => clikRequestDelete(index)} // Eliminar imagen cargada desde el servidor
              className="ml-2"
              type="button"
            >
              <img src={XIcon} alt="Eliminar" className="w-5 h-5" />
            </button>
          </div>
        ))}

        {/* Mostrar las imágenes cargadas localmente (nuevas imágenes) */}
        {object?.length > 0 && object.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          return (
            <div key={index} className="self-stretch h-[55px] p-4 rounded-2xl border border-[#590100] justify-between items-center inline-flex w-[100%]">
              <div className="flex flex-row items-center text-[#030303] text-xl font-normal font-['Roboto']">
                <img
                  src={imageUrl}
                  alt={file.name}
                  className="w-10 h-10 rounded object-cover mr-2"
                />
                {file.name}
              </div>
              <button onClick={() => clikObjectDelete(index)} // Eliminar imagen cargada localmente
                className="ml-2"
                type="button">
                <img src={XIcon} alt="Eliminar" className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default { text, area, number, correo, checkbox, fileimg };
