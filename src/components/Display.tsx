import React, { useEffect, useState } from 'react';
import type { ContentItem } from '../types';

const Display: React.FC = () => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial content
    fetch('/api/display')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setContent(data);
      })
      .catch(err => {
        console.error('Error fetching initial content:', err);
        setError('فشل في تحميل المحتوى');
      });

    // Setup SSE for updates
    const eventSource = new EventSource('/api/display/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'heartbeat') return;
        setContent(data);
        setError(null);
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      setError('فقد الاتصال بالخادم');
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-white text-2xl">{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <p className="text-white text-2xl">جاري تحميل المحتوى...</p>
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
          allowFullScreen
        />
      )}
    </div>
  );
}

export default Display;