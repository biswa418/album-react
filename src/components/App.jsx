import { useEffect, useState } from 'react'
import Loader from './Loader';

function App() {
  const [loading, setLoading] = useState(true)
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    //api call
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.json())
      .then((response) => setAlbums(response))
      .then(() => setLoading(false))
  }, [])

  return (
    <>
      {loading &&
        <Loader />
      }
      {
        !loading
        &&
        <div className='albums'>
          <h2 className='flex'>
            <div class="loader2"></div>
            Albums
          </h2>
          <div className='card-container'>
            {albums.map((album) => {
              return (
                <div key={album.id} className='card'>
                  <span>{album.id}.</span>
                  <p>{album.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      }
    </>
  )
}

export default App
