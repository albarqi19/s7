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
    const eventSource = new EventSource(`${API_CONFIG.BASE_URL}/display-updates`);
    
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

  // إعداد اتصال SSE عند تحميل المكون
  useEffect(() => {
    const cleanup = setupSSE();
    return cleanup;
  }, [setupSSE]);

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const handleContentSelect = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/display`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // لا نحتاج لتحديث activeContentId هنا لأن SSE سيقوم بذلك
    } catch (err) {
      console.error('خطأ في تحديث العرض:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              لوحة التحكم بالعرض
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>

          {error && <ErrorMessage message={error} className="mb-4" />}

          <div className="relative min-h-[200px]">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <LoadingSpinner />
              </div>
            )}

            {contents.length === 0 && !loading && !error ? (
              <div className="text-center py-8 text-gray-500">
                لا يوجد محتوى متاح
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleContentSelect(item.id)}
                    className={`p-4 border rounded-lg transition-colors ${
                      activeContentId === item.id
                        ? 'bg-green-50 border-green-500 ring-2 ring-green-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-lg font-semibold mb-2">{item.id}</div>
                    <div className="text-sm text-gray-600">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      النوع: {item.type === 'image' ? 'صورة' : 'رابط'}
                    </div>
                    {activeContentId === item.id && (
                      <div className="text-xs text-green-600 mt-2 font-semibold">
                        ✓ يعرض الآن
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <footer className="text-center text-gray-500 text-sm py-4">
          تطوير أحمد البارقي لجامع سعيد رداد
        </footer>
      </div>
    </div>
  );
};