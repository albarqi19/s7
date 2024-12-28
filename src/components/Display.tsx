import React, { useEffect, useState } from 'react';
import type { ContentItem } from '../types';

const Display: React.FC = () => {
  const [content, setContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/display-updates');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setContent(data);
    };

    return () => eventSource.close();
  }, []);

  if (!content) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-white text-2xl">Waiting for content...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      {content.type === 'image' ? (
        <img 
          src={content.content} 
          alt={content.name}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <iframe
          src={content.content}
          className="w-full h-full border-0"
          title={content.name}
        />
      )}
    </div>
  );
}

export default Display;