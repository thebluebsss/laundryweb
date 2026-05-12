import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextError } from './TextError';
import { isEmpty } from 'lodash';

type InputIngredientsFreeTextProps = {
  label?: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  inputError?: string;
  disabled?: boolean;
};

export const InputIngredientsFreeText = ({
  label,
  placeholder = 'Add Ingredients',
  value = [],
  onChange,
  inputError,
  disabled
}: InputIngredientsFreeTextProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setInputValue('');
  };

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const handleRemove = (item: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Stack>
      <FormControl fullWidth>
        <Stack width="100%">
          {label && (
            <FormLabel>
              <Typography
                sx={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                lineHeight="20px"
                fontSize={16}
                mb={1.25}
                fontWeight={400}
                color="#161616">
                {label}
              </Typography>
            </FormLabel>
          )}
          <InputStyled
            onClick={handleClick}
            sx={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1
            }}>
            {isEmpty(value) ? (
              <Box component="span" sx={{ color: 'rgba(104, 104, 104, 0.4)', fontStyle: 'normal' }}>
                {placeholder}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  width: '100%'
                }}>
                {value.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #7B96AD',
                      borderRadius: '999px',
                      px: '10px',
                      py: '5px',
                      fontSize: 14,
                      color: '#7B96AD',
                      lineHeight: '18px',
                      whiteSpace: 'nowrap'
                    }}>
                    {item}
                    <Box
                      component="span"
                      onClick={handleRemove(item)}
                      sx={{
                        fontSize: 16,
                        lineHeight: 1,
                        color: '#7B96AD',
                        cursor: 'pointer',
                        display: 'flex',
                        '&:hover': { color: '#000' }
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none">
                        <rect width="12" height="12" rx="6" fill="#EEEEEE" />
                        <path d="M8 4L4 8M8 8L4 4" stroke="#979797" strokeLinecap="round" />
                      </svg>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            <ExpandMoreIcon sx={{ color: '#7B96AD', flexShrink: 0 }} />
          </InputStyled>
        </Stack>
        <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
          {inputError && <TextError errorText={inputError} />}
        </FormHelperText>
      </FormControl>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            border: '1px solid #C6C6C6',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            marginTop: '6px'
          }
        }}>
        <Stack direction="row" gap={1} p={1.5} sx={{ minWidth: 500 }}>
          <InputTextStyled
            placeholder="Enter ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Box
            component="button"
            type="button"
            onClick={handleAdd}
            sx={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7B96AD',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: '#5C7893'
              }
            }}>
            Add
          </Box>
        </Stack>
      </Popover>
    </Stack>
  );
};

const InputStyled = styled(Box)(() => ({
  minHeight: 50,
  borderRadius: 12,
  border: '1px solid #7B96AD',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  boxSizing: 'border-box'
}));

const InputTextStyled = styled('input')(() => ({
  width: '100%',
  padding: '10px 16px',
  borderRadius: 8,
  border: '1px solid #C6C6C6',
  fontSize: 14,
  outline: 'none',
  '&:focus': {
    borderColor: '#7B96AD'
  },
  '&::placeholder': {
    color: 'rgba(104, 104, 104, 0.5)'
  }
}));
