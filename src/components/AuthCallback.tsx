import { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        console.error('OAuth error:', error);
        // Handle error (redirect to error page)
        return;
      }
      
      if (code) {
        try {
          // Retrieve the stored verifier
          const verifier = sessionStorage.getItem('onshape_oauth_verifier');
          
          if (!verifier) {
            throw new Error('No verifier found in session storage');
          }
          
          // Exchange code for tokens
          const tokenResponse = await fetch('https://oauth.onshape.com/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: process.env.REACT_APP_ONSHAPE_CLIENT_ID || '',
              client_secret: process.env.REACT_APP_ONSHAPE_CLIENT_SECRET || '',
              code: code,
              redirect_uri: process.env.REACT_APP_REDIRECT_URI || '',
              code_verifier: verifier,
            }),
          });
          
          if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed: ${tokenResponse.status}`);
          }
          
          const tokenData = await tokenResponse.json();
          
          // Store tokens securely (consider using HTTP-only cookies in production)
          localStorage.setItem('onshape_access_token', tokenData.access_token);
          localStorage.setItem('onshape_refresh_token', tokenData.refresh_token);
          
          // Clear the verifier
          sessionStorage.removeItem('onshape_oauth_verifier');
          
          // Redirect to extension or home page
          window.location.href = '/onshape-extension';
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }
    };
    
    handleCallback();
  }, []);
  
  return <div>Processing authentication...</div>;
};

export default AuthCallback;
