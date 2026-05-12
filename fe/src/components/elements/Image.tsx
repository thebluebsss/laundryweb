import { Box, CircularProgress, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
export type ImageProp = {
  title?: string;
  url: {
    url: string;
    type: string;
  };
  tag?: string;
  onClickTag?: () => void;
  onClickImage?: () => void;
  isZoom?: boolean;
  width?: number;
  height?: number;
};
export const Image = ({
  title,
  url,
  tag,
  onClickTag,
  onClickImage,
  isZoom = true,
  width = 265,
  height = 185
}: ImageProp) => {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let revokeUrl: string | undefined;
    setLoading(true);
    async function loadImage() {
      try {
        setImageSrc(url.url);
      } finally {
        setLoading(false);
      }
    }
    loadImage();
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [url]);

  return (
    <Stack gap={1}>
      {title && (
        <Typography color={'#0B101E'} fontSize={'18px'} fontWeight={900}>
          {title}
        </Typography>
      )}
      <Stack width={'100%'} style={{ position: 'relative' }}>
        <img
          alt={'icon-image-room'}
          src={imageSrc}
          style={{
            width: width,
            height: height,
            objectFit: 'cover',
            background: '#000',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
          onClick={onClickImage}
        />
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: width,
              height: height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
            <CircularProgress />
          </Box>
        )}
        {isZoom && (
          <img
            width={'24px'}
            height={'24px'}
            onClick={() => setOpen(true)}
            alt={'icon-room'}
            src={'/icons/icon_zoom.svg'}
            style={{ position: 'absolute', top: '10px', right: '13px', cursor: 'pointer' }}
          />
        )}
      </Stack>
      {tag && (
        <Stack
          onClick={onClickTag && onClickTag}
          style={{ cursor: 'pointer', flexDirection: 'row', gap: '7px', alignItems: 'center' }}>
          <img width={'16px'} height={'16px'} alt={'icon-tag'} src={'/icons/icon_tag.svg'} />
          <Typography color={'#000'} fontSize={'16px'} fontWeight={400}>
            {tag}
          </Typography>
        </Stack>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'calc(100% - 60px)',
            borderWidth: 0,
            outline: 'none'
          }}>
          <img
            alt="zoomed"
            src={imageSrc}
            style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '10px' }}
          />
        </Box>
      </Modal>
    </Stack>
  );
};
