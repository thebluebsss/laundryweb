import React from 'react';
import { Stack } from '@mui/material';
import { ButtonCustom } from './ButtonCustom';
import { IconGallery } from 'assets';
import { usePreview } from 'hooks/usePreview';

export const Dropzone = ({
  image,
  onImageChange
}: {
  image: File | string | null | undefined;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const imagePreview = usePreview(image);
  return (
    <Stack width="100%">
      <Stack
        width={'100%'}
        minHeight={256}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'19px'}
        sx={{
          borderRadius: '20px',
          border: '1px dashed #7B96AD',
          position: 'relative',
          overflow: 'hidden'
        }}>
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            width: 129,
            height: 129,
            borderRadius: '50%',
            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
            backgroundColor: imagePreview ? 'transparent' : '#E0E0E0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '1px solid #fff',
            zIndex: 1,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)'
          }}>
          {!imagePreview && <IconGallery width={'46.8px'} height={'39px'} />}
        </Stack>
        <Stack>
          <ButtonCustom
            label="Upload Procedure Image"
            component="label"
            sx={{
              backgroundColor: '#7B96AD',
              color: '#FFFFFF',
              borderRadius: '10px',
              height: 44,
              width: 250,
              '&:hover': { backgroundColor: '#5C7893' }
            }}>
            <input hidden accept="image/*" type="file" onChange={onImageChange} />
          </ButtonCustom>
        </Stack>
      </Stack>
    </Stack>
  );
};
