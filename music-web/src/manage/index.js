import {useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {fetchData} from '../utils/fetch';
import SingleItem from './SingleItem';
import Button from './Button';

const ManagePage = () => {
  const [songsList, setSongsList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [refreshFlag, setRefreshFlag] = useState(0);

  const [genresList, setGenresList] = useState([]);

  const [albumsList, setAlbumsList] = useState([]);

  const [currentRecord, setCurrentRecord] = useState(undefined);

  const formRef = useRef();

  const fetchSongs = async () => {
    const res = await fetchData('/api/songs.php');
    console.log(res);
    setSongsList(res?.data);
  }

  const fetchOptions = async () => {
    try {
      const res = await fetchData('/api/options.php');
      setGenresList(res?.data?.genres || []);
      setAlbumsList(res?.data?.albums || []);
    } catch {
      // do nothing
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [refreshFlag]);

  const confirmForm = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.target);
      const title = formData.get('title');
      const artist = formData.get('artist');
      const genre = formData.get('genre');
      const album = formData.get('album');
      const releaseDate = formData.get('release_date');
      const duration = formData.get('duration');
      const params = {
        Title: title,
        Artist: artist,
        ReleaseDate: releaseDate,
        Duration: duration,
        AlbumID: album,
        GenreID: genre
      };
      if (currentRecord) {
        await fetchData(`/api/songs.php/${currentRecord.SongID}`, {
          method: 'PUT',
          body: JSON.stringify(params)
        });
        toast.success('Song updated successfully');
      } else {
        await fetchData('/api/songs.php', {
          method: 'POST',
          body: JSON.stringify(params)
        });
        toast.success('Song added successfully');
      }
      cancelEdit();
      setRefreshFlag((refreshFlag) => refreshFlag + 1);
    } catch {
      // error
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clickDelete = async(record) => {
    try {
      cancelEdit();
      const res = window.confirm(`Are you sure you want to delete ${record.Title}?`)
      if (res) {
        await fetchData(`/api/songs.php/${record.SongID}`, {
          method: 'DELETE'
        })
        setRefreshFlag((refreshFlag) => refreshFlag + 1);
        toast.success('Song deleted successfully');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const clickEdit = (record) => {
    setCurrentRecord(record);
    formRef.current.title.value = record.Title;
    formRef.current.artist.value = record.Artist;
    formRef.current.genre.value = record.GenreID;
    formRef.current.album.value = record.AlbumID;
    formRef.current.release_date.value = record.ReleaseDate;
    formRef.current.duration.value = record.Duration;
  };

  const cancelEdit = () => {
    setCurrentRecord(undefined);
    formRef.current.reset();
  };

  const generateMainContent = () => {
    if (!songsList?.length) {
      return (
        <p>
          No songs found
        </p>
      );
    }

    return (
      <ul>
        {
          songsList.map((item) => {
            return (
              <SingleItem
                key={item.SongID}
                record={item}
                onDelete={clickDelete}
                onEdit={clickEdit}
              />
            );
          })
        }
      </ul>
    );
  };

  return (
    <div>
      <h1>Manage Your Music</h1>
      <section>
        <h2>
          {
            currentRecord ? 'Edit Song' : 'Add a New Song'
          }
        </h2>
        <form
          id='add-music'
          onSubmit={confirmForm}
          ref={formRef}
        >
          <label htmlFor='title'>Song Title:</label>
          <input type='text' id='title' name='title' placeholder='Enter song title' required />
          <label htmlFor='artist'>Artist:</label>
          <input type='text' id='artist' name='artist' placeholder='Enter artist name' required />
          <label htmlFor='release_date'>Release Date:</label>
          <input type='date' id='release_date' name='release_date' required></input>
          <label htmlFor='duration'>Duration (Seconds):</label>
          <input type='number' id='duration' name='duration' placeholder='Enter duration' required />
          <label htmlFor='genre'>Genre:</label>
          <select
            id='genre'
            name='genre'
            required
            
          >
            <option value=''>Choose a Genre</option>
            {
              genresList.map((item) => {
                return (
                  <option
                    key={item.GenreID}
                    value={item.GenreID}
                  >
                    {item.GenreName}
                  </option>
                );
              })
            }
          </select>
          <label htmlFor='album'>Album (Optional):</label>
          <select id='album' name='album'>
            <option value=''>None</option>
            {
              albumsList.map((item) => {
                return (
                  <option
                    key={item.AlbumID}
                    value={item.AlbumID}
                  >
                    {item.AlbumName}
                  </option>
                );
              })
            }
          </select>
          {
            currentRecord ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <button
                  className='cancel'
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
                <Button
                  type='submit'
                  loading={loading}
                >
                  Update Song
                </Button>
              </div>
            ) : (
              <Button type='submit' loading={loading}>Add Song</Button>
            )
          }
        </form>
      </section>
      <section>
        <h2>Existing Songs</h2>
        {generateMainContent()}
      </section>
      <footer>
        &copy; 2024 Music Library. All Rights Reserved.
      </footer>
    </div>
  );
};

export default ManagePage;
