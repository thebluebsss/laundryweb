import { Stack, SxProps, Theme, Typography } from '@mui/material';
import { ArrowIcon } from '../../../assets';
import React, { memo } from 'react';
import { ButtonCustom } from './ButtonCustom';

type Props = {
  title?: string;
  isBack?: boolean;
  button?: {
    title: string;
    onClick?: () => void;
    sx?: SxProps<Theme>;
    disabled?: boolean;
  };
  buttonExtra?: React.ReactNode;
  titleSx?: SxProps<Theme>;
};
export const HeaderScreenAdmin = memo(({ buttonExtra, title, button, isBack, titleSx }: Props) => {
  return (
    <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        gap={1.25}
        sx={{ cursor: isBack ? 'pointer' : 'default' }}
        onClick={() => {
          if (!isBack) return;
          window.history.back();
        }}>
        {isBack && <ArrowIcon />}
        {title && (
          <Typography
            sx={{ margin: 0, fontSize: '24px', fontWeight: 500, color: '#161616', ...titleSx }}>
            {title}
          </Typography>
        )}
      </Stack>
      <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
        {buttonExtra && buttonExtra}
        <Stack>
          {button && (
            <ButtonCustom
              sx={button.sx}
              label={button.title}
              onClick={button.onClick}
              fullWidth
              disabled={button.disabled}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
});
