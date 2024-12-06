import {Route, Routes} from 'react-router';
import './App.css';

import WelcomePage from './welcome';
import SearchPage from './search';
import ManagePage from './manage';

function App() {
  return (
    <Routes>
      <Route index element={<WelcomePage />} />
      <Route path='add-edit-delete' element={<ManagePage />} />
      <Route path='search' element={<SearchPage />} />
    </Routes>
  );
}

export default App;
