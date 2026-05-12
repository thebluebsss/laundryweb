import { FC, ReactNode } from 'react';
import { styled, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ButtonProps } from '@mui/material/Button';
import { SubmitButton, SubmitButtonProps } from './SubmitButton';
import { SxProps } from '@mui/system';

type CustomButtonProps = {
  label?: string;
  typeOutline?: 'black' | 'secondary';
  loading?: boolean;
  isSecondary?: boolean;
  isDelete?: boolean;
  iconStart?: ReactNode;
  textSx?: SxProps<Theme>;
} & ButtonProps &
  SubmitButtonProps;

/**
 * @returns Element PrimaryButton
 */
export const ButtonCustom: FC<CustomButtonProps> = ({
  label,
  isDelete,
  isSecondary,
  iconStart,
  textSx,
  ...props
}) => {
  return (
    <PrimaryButtonStyled $buttonDelete={isDelete} $buttonSecondary={isSecondary} {...props}>
      <>
        {iconStart && iconStart}
        {label && (
          <Typography
            fontSize={16}
            fontWeight={500}
            color={isSecondary ? 'text.primary' : 'common.white'}
            sx={textSx}>
            {label}
          </Typography>
        )}
        {props.children}
      </>
    </PrimaryButtonStyled>
  );
};

/**
 * @returns Element PrimaryButton
 */
export const ButtonOutLine: FC<CustomButtonProps> = ({
  label,
  iconStart,
  typeOutline = 'secondary',
  textSx,
  ...props
}) => {
  return (
    <PrimaryButtonOutLine $typeOutline={typeOutline} {...props}>
      <>
        {iconStart && iconStart}
        {label && (
          <Typography
            fontSize={16}
            fontWeight={500}
            color={typeOutline === 'secondary' ? 'text.secondary' : '#020202'}
            sx={textSx}>
            {label}
          </Typography>
        )}
        {props.children}
      </>
    </PrimaryButtonOutLine>
  );
};
const PrimaryButtonStyled = styled(SubmitButton, {
  shouldForwardProp: (prop) => !String(prop).startsWith('$')
})<{ $buttonDelete?: boolean; $buttonSecondary?: boolean }>(
  ({ theme, $buttonDelete, $buttonSecondary }) => ({
    borderRadius: 10,
    padding: '0 20px',
    width: '100%',
    height: 44,
    background: $buttonDelete
      ? theme.palette.error.main
      : $buttonSecondary
        ? theme.palette.info.light
        : theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: $buttonDelete
        ? theme.palette.error.dark
        : $buttonSecondary
          ? theme.palette.info.light
          : theme.palette.text.secondary
    },
    '&.Mui-disabled': {
      opacity: 0.6
    }
  })
);

const PrimaryButtonOutLine = styled(SubmitButton, {
  shouldForwardProp: (prop) => !String(prop).startsWith('$')
})<{ $typeOutline?: string }>(({ theme, $typeOutline }) => ({
  borderRadius: 10,
  width: '100%',
  height: 44,
  background: 'transparent',
  border: `1px solid ${$typeOutline === 'black' ? '#020202' : theme.palette.text.secondary}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${$typeOutline === 'black' ? '#020202' : theme.palette.text.secondary}`
  },
  '&.Mui-disabled': {
    opacity: 0.6
  }
}));
