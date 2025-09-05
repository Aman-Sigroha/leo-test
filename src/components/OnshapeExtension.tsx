import { useEffect, useState } from 'react';

interface DocumentData {
  documentId: string;
  workspaceId?: string;
  elementId?: string;
}

const OnshapeExtension = () => {
  const [isInOnshape, setIsInOnshape] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  useEffect(() => {
    // Check if we're inside Onshape
    const inIframe = window.self !== window.top;
    setIsInOnshape(inIframe);
    
    if (inIframe) {
      // Listen for messages from Onshape
      window.addEventListener('message', handleOnshapeMessage);
      
      // Request context from Onshape
      window.parent.postMessage({
        type: 'onshape-extension-context-request'
      }, '*');
      
      // Check URL parameters for document context
      const urlParams = new URLSearchParams(window.location.search);
      const documentId = urlParams.get('documentId');
      const workspaceId = urlParams.get('workspaceId');
      const elementId = urlParams.get('elementId');
      
      if (documentId) {
        setDocumentData({ documentId, workspaceId: workspaceId || undefined, elementId: elementId || undefined });
      }
    }
  }, []);

  const handleOnshapeMessage = (event: MessageEvent) => {
    // Validate origin for security
    if (!event.origin.includes('onshape.com')) return;
    
    const data = event.data;
    
    if (data.type === 'onshape-extension-context') {
      setDocumentData(data.context);
    }
  };

  const fetchDocumentInfo = async () => {
    if (!documentData?.documentId) return;
    
    try {
      const accessToken = localStorage.getItem('onshape_access_token');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
      
      const response = await fetch(`https://cad.onshape.com/api/documents/${documentData.documentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const documentInfo = await response.json();
        console.log('Document info:', documentInfo);
        // Process document info as needed
      } else {
        console.error('Failed to fetch document info:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch document info:', error);
    }
  };

  return (
    <div className="onshape-extension">
      <h1>Leo AI Onshape Extension</h1>
      {isInOnshape ? (
        documentData ? (
          <div>
            <p>Connected to Onshape document: {documentData.documentId}</p>
            <button onClick={fetchDocumentInfo}>Load Document Info</button>
            {/* Add your AI features here */}
          </div>
        ) : (
          <p>Loading Onshape context...</p>
        )
      ) : (
        <p>This extension is designed to run within Onshape.</p>
      )}
    </div>
  );
};

export default OnshapeExtension;
