'use client';

import { useState, useCallback } from 'react';
import { Button } from './button';
import { Upload, X, Loader2 } from 'lucide-react';
import { CustomImage } from './custom-image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset file input
      e.target.value = '';

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (client-side)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setError('File size must be less than 2MB');
        return;
      }

      // Reset error state
      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Sending upload request...');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('Upload response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        if (!data.url) {
          throw new Error('No URL returned from server');
        }

        console.log('Upload successful, URL:', data.url);
        onChange(data.url);
      } catch (err) {
        console.error('Error uploading image:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        {value ? (
          <div className="relative group">
            <div className="aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
              <CustomImage
                src={value}
                alt="Project preview"
                className="object-cover w-full h-full"
                width={800}
                height={450}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            className={`
              flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
              ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800'}
              border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500
              transition-colors duration-200 ease-in-out
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {value && !isUploading && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={value}
            readOnly
            className="flex-1 text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 truncate"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(value)}
            className="shrink-0"
          >
            Copy URL
          </Button>
        </div>
      )}
    </div>
  );
}
