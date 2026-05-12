import { FC, ReactNode, ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { TextError } from './TextError';

export type InputProps = {
  value: string;
  type?: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number) => void;
  onBlur?: () => void;
  autoComplete?: string;
};

export type RequiredInputProps = InputProps & { required: true };

type InputTextProps = {
  title?: string;
  inputProps?: InputProps | RequiredInputProps | OutlinedInputProps;
  inputError?: string;
  placeholder?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  errorWithoutText?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null> | null;
  maxLength?: number;
  colorTitle?: string;
  isAuthScreen?: boolean;
};

/**
 * @returns Element InputText
 */
export const InputText: FC<InputTextProps> = ({
  title,
  inputProps,
  inputError,
  placeholder,
  startAdornment,
  endAdornment,
  colorTitle,
  inputRef,
  isAuthScreen
}) => {
  return (
    <FormControl fullWidth error={!!inputError}>
      {title && (
        <FormLabel focused={false}>
          <Typography
            sx={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
            lineHeight={isAuthScreen ? '16px' : '20px'}
            fontSize={isAuthScreen ? 14 : 16}
            mb={1.25}
            fontWeight={isAuthScreen ? 500 : 400}
            color={colorTitle || isAuthScreen ? 'text.secondary' : '#161616'}>
            {title}
          </Typography>
        </FormLabel>
      )}
      <InputStyled
        {...inputProps}
        isAuthScreen={isAuthScreen}
        style={{
          height: isAuthScreen ? 44 : 50
        }}
        autoComplete={inputProps?.autoComplete || 'off'}
        endAdornment={endAdornment}
        inputProps={{
          ref: inputRef
        }}
        placeholder={placeholder}
        startAdornment={startAdornment}
      />
      {inputError && (
        <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
          <TextError errorText={inputError} />
        </FormHelperText>
      )}
    </FormControl>
  );
};

const InputStyled = styled(OutlinedInput, {
  shouldForwardProp: (prop) => prop !== 'isAuthScreen'
})<{ isAuthScreen?: boolean }>(({ theme, isAuthScreen }) => ({
  minHeight: 44,
  fontSize: isAuthScreen ? 14 : 16,
  borderRadius: 10,
  '& .MuiInputBase-input': {
    padding: '12px',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: '#16161666',
      fontFamily: '"Kumbh Sans"',
      fontSize: isAuthScreen ? 14 : 16,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal',
      opacity: 1
    }
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: isAuthScreen ? `1px solid #16161666` : '1px solid #7B96AD',
    borderRadius: 10
  }
}));
