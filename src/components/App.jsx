import { useEffect, useRef, useState } from 'react'
import Loader from './Loader';
import { delUrl, getUrl } from '../constant';
import { FaCheck, FaRegEdit } from 'react-icons/fa'

function App() {
  const [loading, setLoading] = useState(true)
  const [albums, setAlbums] = useState([]);
  const [error, showError] = useState(false);
  const [message, showMessage] = useState('None');
  const [editablePost, setEditPost] = useState(null);
  const [postValue, setPostValue] = useState('');
  const [newPostValue, setnewPostValue] = useState('');
  let inputField = useRef(null);

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

  //debounce -- not needed as we're using submit
  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     console.log(newPostValue)
  //   }, 3000)

  //   return () => clearTimeout(delayDebounce)

  // }, [newPostValue])

  const removeFromState = (id) => {
    const newAlbums = albums.filter((album) => {
      return album.id != id
    })
    setAlbums(newAlbums)
  }

  //delete
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

  //handle Editing an album
  function handleEdit(id, post) {
    setPostValue(post)
    setEditPost(id)
  }

  //handle saving the album
  function handleSave(id) {
    //to make the post disable
    setEditPost(null);

    //api call to update
    fetch(delUrl(id), {
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        title: postValue,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let newAlbum = albums.map((album) => {
          if (json.id === album.id) {
            return json
          }

          return album
        })

        setAlbums(newAlbum)
      });
  }

  //create post
  const handleCreate = () => {
    console.log(JSON.stringify({
      id: `${(albums.length + 2)}`,
      title: newPostValue,
      userId: "11"
    }))

    //api call
    fetch(getUrl, {
      method: 'POST',
      body: JSON.stringify({
        userId: 11,
        id: 101, // the API returns 101 only so no need to use --> (Number(albums[albums.length - 1]['id']) + 1),
        title: newPostValue,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => response.json())
      .then((data) => setAlbums([data, ...albums]))
      .then(setnewPostValue(''))  //clear the textbox
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

          <div
            className='post'
          >
            <textarea
              className='post-text'
              placeholder='Create an album'
              value={newPostValue}
              onChange={(e) => setnewPostValue(e.target.value)}
            >
            </textarea>
            <button className='submit' onClick={handleCreate}>
              Create
            </button>

          </div>

          <div className='card-container'>

            {albums.map((album) => {
              return (
                <div key={`album-${album.id}`} className='card'>
                  <span>{album.id}.</span>

                  {editablePost != album.id ?
                    <>
                      <textarea
                        type='text'
                        disabled
                        ref={inputField}
                        placeholder={album.title}
                      >
                      </textarea>

                      <button
                        className='edit'
                        onClick={() => handleEdit(album.id, album.title)}>
                        <FaRegEdit />
                      </button>
                    </>
                    :
                    <>
                      <textarea
                        type='text'
                        disabled={false}
                        ref={inputField}
                        placeholder={album.title}
                        value={postValue}
                        onChange={(e) => setPostValue(e.target.value)}
                      >
                      </textarea>

                      <button
                        className='edit'
                        onClick={() => handleSave(album.id)}>
                        <FaCheck />
                      </button>
                    </>

                  }
                  <button value={album.id} onClick={handleDelete}>X</button>
                </div>
              )
            })}
          </div>
        </div >
      }
    </>
  )
}

export default App
