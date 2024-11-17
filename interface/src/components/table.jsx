const fila = ({ children, Onclik }) => {
    return (
        <th className="border border-UP-Opaco
         text-UP-Opaco font-roboto font-medium" onClick={Onclik}>
            <div className="flex justify-center gap-2">
            {children}
            </div>
        </th>
    );
};

const columna = ({ children, Onclik }) => {
    return (
        <tr className="border border-UP-Opaco" onClick={Onclik}>
            {children}
        </tr>
    );
};

const encabezado = ({ children }) => {
    return (
        <th className="bg-UP-Secundario border border-UP-Opaco">
            <div className="w-full  py-2 flex justify-center">
                <h1 className="font-montserrat font-bold text-white px-5 text-sm sm:text-base md:text-base lg:text-base">
                    {children}
                </h1>
            </div>
        </th>
    );
};

const table = ({ children }) => {
    return (
        <table className="bg-UP-Blanco">
            {children}
        </table>
    );
};

export default { fila, table, columna, encabezado }