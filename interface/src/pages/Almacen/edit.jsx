import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import peticionDetalles from '../../services/areasService';
import Componentes from '../../components';

const ViewAreaEdit = () => {
  const { pk } = useParams();  // Obtiene el ID del área desde la URL
  const navigate = useNavigate();
  const [area, setArea] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [articulos, setArticulos] = useState([]);  // Artículos sin área
  const [limit, setLimit] = useState({});
  const [selectedArticulos, setSelectedArticulos] = useState([]);  // Artículos seleccionados para el área
  const [query, setQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Para el debounce de búsqueda
  const [error, setError] = useState(null);
  const Peticion = peticionDetalles();
  // Cargar detalles del área
  useEffect(() => {
    const cargarArea = async () => {
      try {
        const result = await Peticion.ObtenerDetalles(pk);
        setArea(result.area);
        setCodigo(result.area.codigo);
        setDescripcion(result.area.descripcion);
        setSelectedArticulos(result.articulos.map(articulo => articulo.pk)); // Aseguramos que sea un array de PKs
      } catch (error) {
        console.log(error);
      }
    };
    cargarArea();
  }, [pk]);
  useEffect(() => {
    cargarArticulos(query);
  }, [query, pk]);
  // Función para cargar artículos sin área, excluyendo el área que estamos editando
  const cargarArticulos = async (query) => {
    setError(null);
    try {
      const result = await Peticion.BuscarOpciones(query, pk);
      setArticulos(result); // Almacenamos los artículos encontrados
    } catch (err) {
      setError(err.message);  // Manejamos cualquier error
    }
  };
  // Función para manejar el cambio en el estado de los checkboxes (selección de artículos)
  const handleCheckboxChange = (articulo) => {
    setSelectedArticulos((prevSelected) => {
      if (prevSelected.includes(articulo.pk)) {
        // Si ya está seleccionado, lo eliminamos
        return prevSelected.filter((item) => item !== articulo.pk);
      } else {
        // Si no está seleccionado, lo añadimos
        return [...prevSelected, articulo.pk];
      }
    });
  };
  // Función para manejar la búsqueda con debounce
  const handleSearchChange = (value) => {
    setQuery(value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      cargarArticulos(value);
    }, 500);
    setDebounceTimeout(newTimeout);
  };
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Peticion.Editar(pk,
        { codigo, descripcion, articulos: [...selectedArticulos] })
      navigate('/almacen'); // Navega a la vista de almacenamiento después de guardar
    } catch (err) {
      setError(err.message);
    }
  };
  if (!area) return <div>Esperando respuesta del servidor...</div>;  // Muestra un mensaje mientras carga el área
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Componentes.Inputs.TitleHeader text={"Edición de Área"} />
      <Componentes.Inputs.TitleSubtitle titulo={"Información del Área"} contenido={"Actualiza los detalles del área."} />
      <Componentes.Labels.text Value={codigo} Onchange={setCodigo} Placeholder={"Código del Área"} />
      <Componentes.Labels.area Value={descripcion} Onchange={setDescripcion} Placeholder={"Descripción del Área"} />
      <Componentes.Inputs.TitleSubtitle titulo={"Seleccionar Artículos"} contenido={"Seleccione los artículos que desea asociar a esta área."} />
      <div className="flex items-center w-[100%]">
        <Componentes.Buscador query={query} OnChange={handleSearchChange} />
      </div>

      {articulos.length > 0 ? (
        <>
          <Componentes.Table.table>
            <Componentes.Table.columna>
              <Componentes.Table.encabezado children={"No. Inventario"} />
              <Componentes.Table.encabezado children={"Nombre"} />
              <Componentes.Table.encabezado children={"Costo"} />
              <Componentes.Table.encabezado children={"Acciones"} />
            </Componentes.Table.columna>
            {articulos.map((articulo, index) => ((index <= limit.max && index >= limit.min) && (
              <Componentes.Table.columna key={articulo.pk}>
                <Componentes.Table.fila children={articulo.no_inventario} />
                <Componentes.Table.fila children={articulo.nombre} />
                <Componentes.Table.fila children={articulo.costo} />
                <Componentes.Table.fila>
                  <Componentes.Labels.checkbox
                    Value={selectedArticulos.includes(articulo.pk)}  //Verificamos si el PK está en la lista de seleccionados
                    Onchange={() => handleCheckboxChange(articulo)}  // Cambiamos el estado de selección al hacer click
                  />
                </Componentes.Table.fila>
              </Componentes.Table.columna>)
            ))}
          </Componentes.Table.table>
          <Componentes.Inputs.Paginacion data={articulos} handleLimit={(value) => setLimit(value)} />
        </>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <Componentes.Inputs.TitleSubtitle
            titulo={"No hay Artículos que mostrar"}
            contenido={"No se encontraron resultados"}
          />
          <Componentes.Inputs.TitleSubtitle titulo={"No hay Artículos para mostrar"} contenido={"No se encontraron resultados"} />
        </div>
      )}

      {error && <Componentes.Modals.error mensaje={error} action={() => setError(null)} />}

      {/* Botones siempre presentes */}
      <div className="flex flex-row w-[100%] justify-center mt-4 gap-4">
        <Componentes.Botones.Cancelar text={"Cancelar"} onClick={() => navigate('/almacen')} />
        <Componentes.Botones.ConfirmarVerde text={"Guardar Cambios"} />
      </div>
    </form>
  );
};

export default ViewAreaEdit;
