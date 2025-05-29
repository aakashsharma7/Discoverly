import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 400,
  height = 300,
  text = 'Placeholder',
  className = '',
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${className}`}
      style={{
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        width: '100%',
        height: '100%',
      }}
    >
      <span className="text-gray-500 text-lg font-medium">{text}</span>
    </div>
  );
}; 