import React from 'react';

const Buscador = ({ query, OnChange }) => {
  return (
    <div className="relative flex m-3 border border-UP-Gris w-[100%]" data-twe-input-wrapper-init data-twe-input-group-ref>
      <input
        type="search"
        value={query}
        onChange={(e) => OnChange(e.target.value)} // Llama a onChange pasado como prop
        className="peer w-full rounded border-0 bg-transparent 
        p-1 outline-none transition-all duration-200 ease-linear 
        focus:placeholder:opacity-100 peer-focus:text-primary 
        data-[twe-input-state-active]:placeholder:opacity-100 
        motion-reduce:transition-none dark:text-UP-Negro
        dark:placeholder:text-transparent
        dark:autofill:shadow-autofill dark:peer-focus:text-primary 
        [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
      />
      <label
        htmlFor="search-input"
        className={`pointer-events-none absolute left-2
            ${query === "" ? 'top-0' : 'top-[-40%] transform scale-75'} 
            mb-0 truncate text-UP-Negro 
            transition-all duration-200 ease-out 
            dark:text-neutral-400 bg-UP-Blanco min-w-[1rem]`}
        >
        Buscar
      </label>
      <button
        className="relative z-[2] -ms-0.5 flex items-center 
        rounded-e bg-primary px-5 text-xs font-medium uppercase 
        leading-normal text-UP-Negro shadow-primary-3 transition 
        duration-150 ease-in-out hover:bg-primary-accent-300 
        hover:shadow-primary-2 focus:bg-primary-accent-300 
        focus:shadow-primary-2 focus:outline-none focus:ring-0 
        active:bg-primary-600 active:shadow-primary-2 
        dark:shadow-black/30 dark:hover:shadow-dark-strong 
        dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        type="button"
        id="search-button"
        data-twe-ripple-init
        data-twe-ripple-color="light"
      >
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Buscador;
