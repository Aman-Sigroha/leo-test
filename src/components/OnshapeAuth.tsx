import { useEffect } from 'react';

const OnshapeAuth = () => {
  useEffect(() => {
    const initiateOAuth = async () => {
      // Generate PKCE code verifier and challenge
      const generateVerifier = () => {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      };
      
      const generateChallenge = async (verifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };
      
      const verifier = generateVerifier();
      const challenge = await generateChallenge(verifier);
      
      // Store verifier in session storage
      sessionStorage.setItem('onshape_oauth_verifier', verifier);
      
      // Construct authorization URL
      const authUrl = new URL('https://oauth.onshape.com/oauth/authorize');
      authUrl.searchParams.append('client_id', process.env.REACT_APP_ONSHAPE_CLIENT_ID || '');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', process.env.REACT_APP_REDIRECT_URI || '');
      authUrl.searchParams.append('scope', 'OAuth2Read OAuth2Write');
      authUrl.searchParams.append('code_challenge', challenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      
      // Redirect to Onshape
      window.location.href = authUrl.toString();
    };
    
    initiateOAuth();
  }, []);
  
  return <div>Redirecting to Onshape for authentication...</div>;
};

export default OnshapeAuth;
