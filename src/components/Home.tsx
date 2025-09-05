import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Leo AI Onshape Extension</h1>
      <p>Welcome to the Leo AI Onshape Extension. This app provides AI-powered features for Onshape CAD software.</p>
      
      <div className="navigation">
        <Link to="/auth" className="auth-button">
          Authenticate with Onshape
        </Link>
        <Link to="/onshape-extension" className="extension-button">
          Go to Extension
        </Link>
      </div>
      
      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>OAuth2 authentication with Onshape</li>
          <li>Secure token management</li>
          <li>Document context integration</li>
          <li>AI-powered CAD assistance</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
