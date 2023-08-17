'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [musicas, setMusicas] = useState([]);
  const [artista, setArtista] = useState('');
  const [nome, setNome] = useState('');
  const [idEditado, setIdEditado] = useState(null);

  useEffect(() => {
    axios.get('https://64371cd28205915d340515d5.mockapi.io/musicas').then((response) => {
      setMusicas(response.data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (idEditado) {
      // Update existing music
      axios.put(`https://64371cd28205915d340515d5.mockapi.io/musicas/${idEditado}`, {
        artista,
        nome,
      }).then((response) => {
        const updatedMusicas = musicas.map((musica) => {
          if (musica.id === idEditado) {
            return response.data;
          }
          return musica;
        });
        setMusicas(updatedMusicas);
        setIdEditado(null);
        setArtista('');
        setNome('');
      });
    } else {
      // Create new music
      axios.post('https://64371cd28205915d340515d5.mockapi.io/musicas', {
        artista,
        nome,
      }).then((response) => {
        setMusicas([...musicas, response.data]);
        setArtista('');
        setNome('');
      });
    }
  }

  function handleEdit(id) {
    const novaMusica = musicas.find((musica) => musica.id === id);
    setArtista(novaMusica.artista);
    setNome(novaMusica.nome);
    setIdEditado(id);
  }

  function handleDelete(id) {
    axios.delete(`https://64371cd28205915d340515d5.mockapi.io/musicas/${id}`).then(() => {
      setMusicas(musicas.filter((musica) => musica.id !== id));
    });
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col'>
        <div className='mb-8'>
        {idEditado ? (
          <h1 className='mb-2 '>Editar Música:</h1>
        ) : (
          <h1 className='mb-2'>Adicionar uma Música:</h1>
        )}
        <form onSubmit={handleSubmit} className='flex justify-center flex-col w-512'>
          <label htmlFor=''>Artista:</label>
          <input
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
            type='text'
            className='border-black border-2'
          />

          <label htmlFor=''>Nome:</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            type='text'
            className='border-black border-2'
          />
            {idEditado ? (
            <button className='bg-blue-500 mt-4 py-1 px-2 rounded-lg text-white'>Atualizar</button> 
            ) : (
            <button className='bg-green-500 mt-4 py-1 px-2 rounded-lg text-white'>Criar</button> 
            )}
        </form>
      </div>
    </div>

      <ul className='grid grid-rows-5 grid-flow-col gap-8 w-128'>
        {musicas?.map((musica) => (
          <li key={musica.id} className='bg-gray-300 p-4 rounded-lg'>
            <h2>Artista: {musica.artista}</h2>
            <h2>Nome: {musica.nome}</h2>
            <div className='flex justify-evenly'>
              <button
                onClick={() => handleDelete(musica.id)}
                className='bg-red-500 mt-4 py-1 px-2 rounded-lg text-white'
              >
                Deletar
              </button>
              <button
                onClick={() => handleEdit(musica.id)}
                className='bg-blue-500 mt-4 py-1 px-2 rounded-lg text-white'
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
