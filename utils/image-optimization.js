import Image from 'next/image';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  ...props
}) => {
  // Handle external URLs
  if (src.startsWith('http')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized
        {...props}
      />
    );
  }

  // Handle local images
  const imagePath = src.startsWith('/') ? `${basePath}${src}` : `${basePath}/${src}`;
  
  return (
    <Image
      src={imagePath}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      {...props}
    />
  );
};

export const BackgroundImage = ({
  src,
  alt = '',
  className = '',
  children,
  ...props
}) => {
  const imagePath = src.startsWith('http') ? src : `${basePath}${src.startsWith('/') ? '' : '/'}${src}`;
  
  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      {...props}
    >
      {children}
    </div>
  );
};
