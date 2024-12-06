import {useState} from 'react';
import {fetchData} from '../utils/fetch';
import {toast} from 'react-toastify';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const confirmSearch = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const searchText = formData.get('search');
      const res = await fetchData(`/api/songs.php?search=${searchText}`, {
        method: 'GET'
      });
      console.log(res);
      const data = res?.data || [];
      setSearchResults(data);
      toast.success(`Searched ${data.length} results`);
    } catch {
      // do nothing
    }
  }

  const generateMainContent = () => {
    if (!searchResults?.length) {
      return (
        <p>
          No results found
        </p>
      );
    }

    return (
      <ul>
        {
          searchResults.map((item) => {
            return (
              <li key={item.SongID}>
                {item.Title} by {item.Artist} ({item.GenreName})
              </li>
            );
          })
        }
      </ul>
    );
  }

  return (
    <div>
      <h1>Search Music Library</h1>
      <section>
        <h2>Search for Songs, Albums, or Playlists</h2>
        <form
          id='search-form'
          onSubmit={confirmSearch}
        >
          <label htmlFor='search'>Search:</label>
          <input type='text' id='search' name='search' placeholder='Enter a keyword' required />
          <button type='submit'>Search</button>
        </form>
      </section>
      <section>
        <h2>Search Results</h2>
        {
          generateMainContent()
        }
      </section>
      <footer>
        &copy; 2024 Music Library. All Rights Reserved.
      </footer>
    </div>
  );
};

const ListItem = ({label, value}) => {
  return (
    <span>
      <span>
        {label}：
      </span>
      <span>
        {value}
      </span>
    </span>
  );
};

export default SearchPage;
