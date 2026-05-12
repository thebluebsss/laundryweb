import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { SelectProps, Stack, styled, Typography, Checkbox } from '@mui/material';
import { SelectOptions } from './InputSelect';
import { isEmpty } from 'lodash';
import FormLabel from '@mui/material/FormLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormHelperText from '@mui/material/FormHelperText';
import { TextError } from './TextError';
import { useEffect } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

type InputSelectMultipleProps = SelectProps & {
  options: SelectOptions[];
  onChangeInput?: (value: string[]) => void;
  placeholder?: string;
  defaultValue?: string[];
  label?: string;
  inputError?: string;
  listChooseSelect: string[];
  isAuthScreen?: boolean;
};

export const InputSelectMultiple = ({
  label,
  options,
  isAuthScreen,
  placeholder,
  onChangeInput,
  inputError,
  listChooseSelect,
  ...rest
}: InputSelectMultipleProps) => {
  const [listChoose, setListChoose] = React.useState<string[]>([]);

  useEffect(() => {
    setListChoose(listChooseSelect);
  }, [listChooseSelect]);
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value }
    } = event;
    onChangeInput && onChangeInput(value as string[]);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    let newList = [...listChoose];
    if (event.target.checked) {
      if (!newList.includes(value)) {
        newList.push(value);
      }
    } else {
      newList = newList.filter((item) => item !== value);
    }
    onChangeInput && onChangeInput(newList);
  };
  return (
    <Stack>
      <FormControl fullWidth>
        <Stack width={'100%'}>
          {label && (
            <FormLabel>
              <Typography
                sx={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                lineHeight={isAuthScreen ? '16px' : '20px'}
                fontSize={isAuthScreen ? 14 : 16}
                mb={1.25}
                fontWeight={isAuthScreen ? 500 : 400}
                color={isAuthScreen ? 'text.secondary' : '#161616'}>
                {label}
              </Typography>
            </FormLabel>
          )}
          <SelectStyled
            {...rest}
            displayEmpty
            IconComponent={ExpandMoreIcon}
            multiple
            value={listChoose}
            onChange={handleChange}
            renderValue={() => {
              if (isEmpty(listChoose)) {
                return (
                  <em style={{ color: 'rgba(104, 104, 104, 0.4)', fontStyle: 'normal' }}>
                    {placeholder}
                  </em>
                );
              }
              return (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    width: '100%',
                    cursor: rest.disabled ? 'not-allowed' : 'auto'
                  }}>
                  {(listChoose as string[])?.map((value, index) => {
                    const selectedOption = options.find(
                      (item: SelectOptions) => value === item.value
                    );
                    if (!selectedOption) return null;
                    return (
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
                        {selectedOption.label}
                        <Box
                          component="span"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const newList = listChoose.filter((v) => v !== value);
                            onChangeInput && onChangeInput(newList);
                          }}
                          sx={{
                            fontSize: 16,
                            lineHeight: 1,
                            color: '#7B96AD',
                            cursor: 'pointer',
                            '&:hover': { color: '#000' }
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none">
                            <rect width="12" height="12" rx="6" fill="#EEEEEE" />
                            <path d="M8 4L4 8M8 8L4 4" stroke="#979797" stroke-linecap="round" />
                          </svg>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            }}
            MenuProps={MenuProps}>
            <MenuItem disabled value="">
              <em>{placeholder}</em>
            </MenuItem>
            {options.map((op: SelectOptions) => (
              <MenuItemStyled key={op.value} value={op.value}>
                <Stack alignItems={'center'} flexDirection={'row'} gap={0.25}>
                  <Checkbox
                    checked={listChoose.includes(op.value)}
                    onChange={(event) => handleCheckboxChange(event, op.value)}
                    sx={{
                      color: '#7B96AD',
                      '&.Mui-checked': { color: '#7B96AD' },
                      borderRadius: '6px',
                      p: '4px'
                    }}
                  />
                  <TextChildStyled>{op.label}</TextChildStyled>
                </Stack>
              </MenuItemStyled>
            ))}
          </SelectStyled>
        </Stack>
        <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
          {inputError && <TextError errorText={inputError} />}
        </FormHelperText>
      </FormControl>
    </Stack>
  );
};

const MenuItemStyled = styled(MenuItem)(() => ({
  height: 50
}));

const TextChildStyled = styled(Typography)(() => ({
  lineHeight: 'normal',
  color: '#000'
}));

const SelectStyled = styled(Select)(() => ({
  height: 'auto',
  minHeight: 50,
  '&.MuiInputBase-root': {
    borderRadius: '12px',
    outline: 'none'
  },
  '& .MuiInputBase-input': {
    padding: '10px 20px',
    height: 'auto !important'
  },
  '.MuiMenu-list': {
    paddingBottom: 0
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: `1px solid #7B96AD`,
    borderRadius: 12,
    '.css-14lo706': {
      width: 0
    }
  }
}));
