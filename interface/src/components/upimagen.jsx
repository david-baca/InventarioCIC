import { useState } from 'react';
import Picturi from '../../public/picturi.svg';
import XIcon from '../../public/X.svg';

const Upimagen = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Verificar si el total de imágenes más las nuevas exceden 5
    if (images.length + files.length > 5) {
      alert("No puedes cargar más de 5 imágenes.");
      return; // Detiene la ejecución si se excede el límite
    }

    setImages((prevImages) => [...prevImages, ...files]);
  };

  return (
    <div className="h-[505px] flex-col justify-start items-start gap-4 inline-flex">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />

      <label
        htmlFor="image-upload"
        className="self-stretch h-[150px] p-4 bg-[#efefef] rounded-xl border border-dashed border-[#590100] justify-center items-center inline-flex cursor-pointer"
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

      <div className="flex-col gap-2">
        {images.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="self-stretch h-[55px] p-4 rounded-2xl border border-[#590100] justify-between items-center inline-flex"
            >
              <img
                src={imageUrl}
                alt={file.name}
                className="w-10 h-10 rounded object-cover mr-2"
              />
              <div className="text-[#030303] text-xl font-normal font-['Roboto']">
                {file.name}
              </div>
              <button
                onClick={() => {
                  setImages(images.filter((_, i) => i !== index));
                }}
                className=" ml-2"
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

export default Upimagen;