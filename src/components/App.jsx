import { useEffect, useState } from 'react'
import Loader from './Loader';
import { delUrl, getUrl } from '../constant';

function App() {
  const [loading, setLoading] = useState(true)
  const [albums, setAlbums] = useState([]);
  const [error, showError] = useState(false);
  let [message, showMessage] = useState('None');

  useEffect(() => {
    //api call
    fetch(getUrl)
      .then(response => response.json())
      .then((response) => setAlbums(response))
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        showMessage(err);
        showError(true);
      })
  }, [])

  const removeFromState = (id) => {
    const newAlbums = albums.filter((album) => {
      return album.id != id
    })

    setAlbums(newAlbums)
  }

  function handleDelete(e) {
    e.preventDefault();
    e.target.innerText = '-'

    fetch(delUrl(e.target.value), {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .then(() => {
        removeFromState(e.target.value)
      })
      .catch((err) => {
        setLoading(false);
        showMessage(err);
        showError(true);
      })
  }

  return (
    <>
      {loading &&
        <Loader />
      }

      {!loading && error &&
        <>
          <p className='card-container'>
            {`Issue in loading.. check your internet connection. ${message}`}
          </p>
        </>
      }

      {
        !loading && !error
        &&
        <div className='albums'>
          <h2 className='flex'>
            <div className="loader2"></div>
            Albums
          </h2>

          <div className='card-container'>
            {albums.map((album) => {
              return (
                <div key={`album-${album.id}`} className='card'>
                  <span>{album.id}.</span>
                  <p>{album.title}</p>
                  <button value={album.id} onClick={handleDelete}>X</button>
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
