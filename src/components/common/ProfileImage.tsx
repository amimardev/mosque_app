import React, { useState } from 'react';

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
  const showFallback = !src || hasError;

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
