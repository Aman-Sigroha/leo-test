import { useEffect } from 'react';

const OnshapeAuth = () => {
  useEffect(() => {
    const initiateOAuth = async () => {
      // Get environment variables with fallback
      const clientId = process.env.REACT_APP_ONSHAPE_CLIENT_ID || 'SQ6ZTWKSL3VUD4HZWGJHKT7GJTSFEXMMATDR45I=';
      const redirectUri = process.env.REACT_APP_REDIRECT_URI || 'https://leo-test-wine.vercel.app/auth/callback';
      
      // Validate required parameters
      if (!clientId) {
        console.error('REACT_APP_ONSHAPE_CLIENT_ID is not defined');
        return;
      }
      
      if (!redirectUri) {
        console.error('REACT_APP_REDIRECT_URI is not defined');
        return;
      }
      
      console.log('OAuth Configuration:', {
        clientId,
        redirectUri,
        scope: 'OAuth2Read OAuth2Write'
      });
      
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
      
      console.log('PKCE Generated:', {
        verifier: verifier.substring(0, 8) + '...',
        challenge: challenge.substring(0, 8) + '...'
      });
      
      // Store verifier in session storage
      sessionStorage.setItem('onshape_oauth_verifier', verifier);
      
      // Construct authorization URL
      const authUrl = new URL('https://oauth.onshape.com/oauth/authorize');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('scope', 'OAuth2Read OAuth2Write');
      authUrl.searchParams.append('code_challenge', challenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      
      // Log the complete auth URL for debugging
      console.log('Generated Auth URL:', authUrl.toString());
      
      // Redirect to Onshape
      window.location.href = authUrl.toString();
    };
    
    initiateOAuth();
  }, []);
  
  return (
    <div>
      <h2>Redirecting to Onshape for authentication...</h2>
      <p>Please wait while we redirect you to Onshape OAuth.</p>
      <p>Check the browser console for debugging information.</p>
    </div>
  );
};

export default OnshapeAuth;
