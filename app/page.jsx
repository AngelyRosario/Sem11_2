'use client'
import { useEffect, useState } from 'react';

const cargardatos = () => {
  return fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json());
};

const Page = () => {
  const [datos, setDatos] = useState([]);
  const [ordenCampo, setOrdenCampo] = useState(null);
  const [ordenInverso, setOrdenInverso] = useState(false);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    cargardatos().then(data => setDatos(data));
  }, []);

  // Función para ordenar los datos por un campo específico
  const ordenarPorCampo = (campo) => {
    if (campo === ordenCampo) {
      setOrdenInverso(!ordenInverso);
    } else {
      setOrdenCampo(campo);
      setOrdenInverso(false);
    }
  };

  // Función para filtrar por el campo 'title'
  const filtrarPorTitulo = (event) => {
    const valor = event.target.value.toLowerCase();
    setFiltroTitulo(valor);
    setPaginaActual(1); // Resetear a la primera página al filtrar
  };

  // Filtrar y ordenar los datos según los estados actuales
  let datosFiltrados = datos.filter(item =>
    item.title.toLowerCase().includes(filtroTitulo)
  );

  if (ordenCampo) {
    datosFiltrados.sort((a, b) => {
      const campoA = a[ordenCampo];
      const campoB = b[ordenCampo];
      if (campoA < campoB) return ordenInverso ? 1 : -1;
      if (campoA > campoB) return ordenInverso ? -1 : 1;
      return 0;
    });
  }

  // Paginación
  const elementosPorPagina = 8;
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const datosPaginados = datosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento);

  // Renderiza el componente
  return (
    <div className="contenedor">
      <h1>Lista de datos</h1>
      <input
        type="text"
        placeholder="Buscar por título..."
        value={filtroTitulo}
        onChange={filtrarPorTitulo}
      />
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th onClick={() => ordenarPorCampo('id')}>ID</th>
              <th onClick={() => ordenarPorCampo('title')}>Título</th>
              <th onClick={() => ordenarPorCampo('body')}>Cuerpo</th>
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map(({ id, title, body }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="paginacion">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={datosFiltrados.length <= indiceUltimoElemento}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Page;
