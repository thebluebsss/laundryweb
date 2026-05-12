import { FC, ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { TextError } from './TextError';

type InputAreaProps = {
  title?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  inputError?: string;
  placeholder?: string;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  colorTitle?: string;
  isAuthScreen?: boolean;
  disabled?: boolean;
};

/**
 * @returns Element InputArea (Textarea)
 */
export const InputArea: FC<InputAreaProps> = ({
  title,
  value,
  onChange,
  onBlur,
  inputError,
  placeholder,
  rows = 4,
  minRows,
  maxRows,
  colorTitle,
  isAuthScreen,
  disabled
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
      <TextareaStyled
        disabled={disabled}
        multiline
        rows={rows}
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete="off"
      />
      {inputError && (
        <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
          <TextError errorText={inputError} />
        </FormHelperText>
      )}
    </FormControl>
  );
};

const TextareaStyled = styled(OutlinedInput)(() => ({
  borderRadius: 10,
  fontSize: 16,
  alignItems: 'flex-start',
  '& .MuiInputBase-input': {
    padding: '4px',
    '&::placeholder': {
      color: '#16161666',
      fontFamily: '"Kumbh Sans"',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal',
      opacity: 1
    }
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #7B96AD',
    borderRadius: 10
  }
}));
