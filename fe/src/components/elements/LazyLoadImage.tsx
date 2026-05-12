import { LazyLoadImage as LazyLoadImageLib } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ImgHTMLAttributes } from 'react';

type LazyLoadImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  effect?: 'blur' | 'opacity' | 'black-and-white';
  placeholderSrc?: string;
  threshold?: number;
};

export const LazyLoadImage = ({
  effect = 'blur',
  placeholderSrc,
  threshold = 100,
  ...imgProps
}: LazyLoadImageProps) => {
  return (
    <LazyLoadImageLib
      {...imgProps}
      effect={effect}
      placeholderSrc={placeholderSrc}
      threshold={threshold}
    />
  );
};
