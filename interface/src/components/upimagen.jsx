// Upimagen.js
import Picturi from '../../public//img/picturi.svg';
import XIcon from '../../public//img/X.svg';

// Componente para subir nuevas imágenes
const Upimagen = ({ images, ImageUpload, clikDelete }) => {
  return (
    <div className="flex-col justify-start items-start gap-4 inline-flex">
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
            Arrastra tu imagen aquí {images.length}/5
          </div>
        </div>
      </label>

      {/* Mostrar las imágenes cargadas */}
      <div className="flex flex-col gap-2 w-[100%]">
        {images.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          return (
            <div key={index}
              className="self-stretch h-[55px] p-4 rounded-2xl border border-[#590100] justify-between items-center inline-flex w-[100%]"
            >
              <div className="flex flex-row items-center text-[#030303] text-xl font-normal font-['Roboto']">
                <img
                  src={imageUrl}
                  alt={file.name}
                  className="w-10 h-10 rounded object-cover mr-2"
                />
                {file.name}
              </div>
              <button
                onClick={() => clikDelete(index)}
                className=" ml-2"
                type="button"
              >
                <img src={XIcon} alt="Eliminar" className="w-5 h-5" /> 
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EditUpimagen = ({ object, request, ImageUpload, clikObjectDelete, clikRequestDelete }) => {
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
            Arrastra tu imagen aquí {request.length + object.length}/5
          </div>
        </div>
      </label>

      <div className="flex flex-col gap-2 w-[100%]">
        {/* Mostrar las imágenes cargadas desde el servidor (request) */}
        {request.length > 0 && request.map((image, index) => (
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
        {object.length > 0 && object.map((file, index) => {
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

export default { Upimagen, EditUpimagen };
