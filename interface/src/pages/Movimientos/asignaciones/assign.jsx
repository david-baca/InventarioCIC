import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { FaSearch } from 'react-icons/fa';

// Componente principal de selección de responsable
const ViewAssigned = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const responsables = [
    { id: 1, correo: 'David Stephen', usuario: 'Baca' },
    { id: 2, correo: 'Ana', usuario: 'Sanchez' },
    { id: 3, correo: 'Sonia Fernanda', usuario: 'Estroza' },
    // Agrega más responsables si es necesario
  ];

  const filteredResponsables = responsables.filter((responsable) =>
    responsable.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    responsable.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResponsables.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredResponsables.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

 

  return (

    <>
        
    </>
  );
};

export default ViewAssigned;
