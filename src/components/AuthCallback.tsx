import { useEffect, useState } from 'react';

const AuthCallback = () => {
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      console.log('OAuth Callback received:', {
        code: code ? code.substring(0, 8) + '...' : 'none',
        error,
        errorDescription,
        fullUrl: window.location.href
      });
      
      if (error) {
        const errorMsg = `OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`;
        console.error(errorMsg);
        setError(errorMsg);
        setStatus('Authentication failed');
        return;
      }
      
      if (code) {
        try {
          setStatus('Exchanging code for tokens...');
          
          // Get environment variables with fallback
          const clientId = process.env.REACT_APP_ONSHAPE_CLIENT_ID || 'SQ6ZTWKSL3VUD4HZWGJHKT7GJTSFEXMMATDR45I=';
          const clientSecret = process.env.REACT_APP_ONSHAPE_CLIENT_SECRET || '6XZETM4BDBARN0ZJMZR2UQZHRQ34H76KSHS44MFLEYG2M763YNFQ====';
          const redirectUri = process.env.REACT_APP_REDIRECT_URI || 'https://leo-test-wine.vercel.app/auth/callback';
          
          // Retrieve the stored verifier
          const verifier = sessionStorage.getItem('onshape_oauth_verifier');
          
          if (!verifier) {
            throw new Error('No verifier found in session storage');
          }
          
          console.log('Token exchange parameters:', {
            clientId,
            redirectUri,
            verifier: verifier.substring(0, 8) + '...',
            code: code.substring(0, 8) + '...'
          });
          
          // Exchange code for tokens
          const tokenResponse = await fetch('https://oauth.onshape.com/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              redirect_uri: redirectUri,
              code_verifier: verifier,
            }),
          });
          
          console.log('Token response status:', tokenResponse.status);
          
          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
          }
          
          const tokenData = await tokenResponse.json();
          console.log('Token exchange successful:', {
            access_token: tokenData.access_token ? tokenData.access_token.substring(0, 8) + '...' : 'none',
            token_type: tokenData.token_type,
            expires_in: tokenData.expires_in
          });
          
          // Store tokens securely (consider using HTTP-only cookies in production)
          localStorage.setItem('onshape_access_token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('onshape_refresh_token', tokenData.refresh_token);
          }
          
          // Clear the verifier
          sessionStorage.removeItem('onshape_oauth_verifier');
          
          setStatus('Authentication successful! Redirecting...');
          
          // Redirect to extension or home page
          setTimeout(() => {
            window.location.href = '/onshape-extension';
          }, 1000);
        } catch (error) {
          console.error('Authentication failed:', error);
          setError(error instanceof Error ? error.message : 'Unknown error occurred');
          setStatus('Authentication failed');
        }
      } else {
        setError('No authorization code received');
        setStatus('Authentication failed');
      }
    };
    
    handleCallback();
  }, []);
  
  return (
    <div>
      <h2>{status}</h2>
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <p>Check the browser console for detailed debugging information.</p>
    </div>
  );
};

export default AuthCallback;
