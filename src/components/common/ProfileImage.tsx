import React, { useEffect, useState } from 'react';

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  title?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  className = '',
  title,
  referrerPolicy,
}) => {
  const [hasError, setHasError] = useState(false);
  const isGeneratedPlaceholder = src?.includes('api.dicebear.com') ?? false;
  const showFallback = !src || isGeneratedPlaceholder || hasError;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <img
      src={showFallback ? '/icon.png' : src}
      alt={alt}
      title={title}
      referrerPolicy={referrerPolicy}
      className={`${className} ${showFallback ? 'object-contain' : 'object-cover'}`}
      onError={() => setHasError(true)}
    />
  );
};
