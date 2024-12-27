import React, { useCallback, useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { useContents } from '../hooks/useContents';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';
import { API_CONFIG } from '../services/api/config';

export const AdminPanel: React.FC = () => {
  const { contents, loading, error, refresh } = useContents();
  const [activeContentId, setActiveContentId] = useState<number | null>(null);

  const setupSSE = useCallback(() => {
    const eventSource = new EventSource('/api/display/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const content = JSON.parse(event.data);
        setActiveContentId(content.id);
      } catch (err) {
        console.error('خطأ في معالجة تحديث العرض:', err);
      }
    };

    eventSource.onerror = () => {
      console.error('خطأ في اتصال SSE');
      eventSource.close();
      // إعادة المحاولة بعد 5 ثواني
      setTimeout(setupSSE, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = setupSSE();
    return cleanup;
  }, [setupSSE]);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const handleContentSelect = useCallback(async (id: number) => {
    try {
      const response = await fetch('/api/display/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث العرض');
      }

      setActiveContentId(id);
    } catch (err) {
      console.error('خطأ في تحديث العرض:', err);
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة التحكم بالعرض</h1>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-gray-100"
          title="تحديث"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contents?.map((content) => (
          <div
            key={content.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              activeContentId === content.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-400'
            }`}
            onClick={() => handleContentSelect(content.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{content.name}</span>
              <span className="text-sm text-gray-500">
                {content.type === 'image' ? 'صورة' : 'رابط'}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{content.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};