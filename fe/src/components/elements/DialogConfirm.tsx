import { Dialog, Stack, styled, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { ButtonCustom, ButtonOutLine } from './ButtonCustom';
import { ReactNode } from 'react';
import { TypographyProps } from '@mui/material/Typography';

type DialogConfirmType = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  textTitle?: string;
  textContent?: string;
  textButton?: string;
  textCancel?: string;
  isDelete?: boolean;
  isIconClose?: boolean;
  children?: ReactNode;
  maxWidth?: number;
  dialogSx?: SxProps<Theme>;
  titleProps?: TypographyProps;
  wrapperContentProps?: SxProps<Theme>;
  wrapperHeader?: SxProps<Theme>;
  wrapperButton?: SxProps<Theme>;
  extraHeader?: ReactNode;
  scrollAreaSx?: SxProps<Theme>;
};
export const DialogConfirm = ({
  isOpen,
  onClose,
  onSubmit,
  textContent,
  textTitle,
  textButton,
  isDelete,
  isIconClose,
  children,
  maxWidth,
  titleProps,
  textCancel,
  wrapperButton,
  wrapperContentProps,
  wrapperHeader,
  extraHeader,
  dialogSx,
  scrollAreaSx
}: DialogConfirmType) => {
  return (
    <Dialog
      PaperProps={{
        sx: { maxWidth: maxWidth || 600, borderRadius: '10px', background: '#fff', ...dialogSx }
      }}
      open={isOpen}
      onClose={() => {
        if (isIconClose) return;
        onClose();
      }}
      fullWidth>
      <WrapperDialog width={'100%'}>
        <Stack
          my={'30px'}
          width={'100%'}
          px={'30px'}
          alignItems={'center'}
          sx={wrapperContentProps}>
          <Stack
            width={'100%'}
            flexDirection={'row'}
            sx={wrapperHeader}
            justifyContent={'space-between'}>
            <Stack
              flexDirection={'row'}
              gap={'33px'}
              flex={1}
              alignItems={extraHeader ? 'center' : 'flex-start'}>
              {textTitle && (
                <TitleStyled fontSize={'24px'} color={'#000'} {...titleProps}>
                  {textTitle}
                </TitleStyled>
              )}
              {extraHeader}
            </Stack>
            {isIconClose && (
              <img
                style={{ cursor: 'pointer' }}
                onClick={onClose}
                alt={'icon_delete'}
                width={'20px'}
                src={'/icons/icon_cancel.svg'}
              />
            )}
          </Stack>
          <Stack
            pr={'6px'}
            width="100%"
            maxHeight="80vh"
            overflow="auto"
            sx={[
              {
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { background: '#ccc', borderRadius: '4px' }
              },
              ...(scrollAreaSx ? (Array.isArray(scrollAreaSx) ? scrollAreaSx : [scrollAreaSx]) : [])
            ]}>
            {textContent && <ContentStyled textAlign="center">{textContent}</ContentStyled>}
            {children && children}
            {(textButton || textCancel) && (
              <Stack
                flexDirection="row"
                alignItems={'center'}
                justifyContent={'center'}
                gap={2}
                width={'100%'}
                sx={wrapperButton}>
                {textCancel && (
                  <ButtonOutLine
                    sx={{ width: 200 }}
                    label={textCancel}
                    onClick={onClose}
                    fullWidth
                  />
                )}
                {textButton && (
                  <ButtonCustom
                    sx={{ width: 200 }}
                    isDelete={isDelete}
                    label={textButton}
                    fullWidth
                    onClick={onSubmit}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </WrapperDialog>
    </Dialog>
  );
};

const WrapperDialog = styled(Stack)(() => ({
  borderRadius: '20px'
}));
const TitleStyled = styled(Typography)(() => ({
  fontWeight: 500,
  textAlign: 'center'
}));
const ContentStyled = styled(Typography)(() => ({
  fontSize: '20px',
  color: '#000',
  fontWeight: 400,
  whiteSpace: 'pre-line'
}));
