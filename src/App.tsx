import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnshapeAuth from './components/OnshapeAuth';
import AuthCallback from './components/AuthCallback';
import OnshapeExtension from './components/OnshapeExtension';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<OnshapeAuth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onshape-extension" element={<OnshapeExtension />} />
      </Routes>
    </Router>
  );
}

export default App;
