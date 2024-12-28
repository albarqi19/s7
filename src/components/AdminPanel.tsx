import React, { useCallback } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { useContents } from '../hooks/useContents';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

export const AdminPanel: React.FC = () => {
  const { contents, loading, error, refresh } = useContents();

  const handleContentSelect = useCallback(async (id: number) => {
    try {
      await fetch('/api/display', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error('خطأ في تحديث العرض:', err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              لوحة التحكم بالعرض
            </h1>
            <button
              onClick={refresh}
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
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-lg font-semibold mb-2">{item.id}</div>
                    <div className="text-sm text-gray-600">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      النوع: {item.type === 'image' ? 'صورة' : 'رابط'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t text-center text-gray-500 text-sm">
            تطوير أحمد البارقي لجامع سعيد رداد
          </div>
        </div>
      </div>
    </div>
  );
};