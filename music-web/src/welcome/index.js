import {Link} from "react-router";

const WelcomePage = () => {
  return (
    <div>
      <h1>Welcome to the Music Library</h1>
      <nav>
        <Link to='add-edit-delete'>Manage Music</Link>
        <Link to='search'>Search Music</Link>
      </nav>
      <section>
        <h2>Featured Playlist</h2>
        <p>Music Library</p>
      </section>
      <footer>
        &copy; 2024 Music Library. All Rights Reserved.
      </footer>
    </div>
  );
};

export default WelcomePage;
