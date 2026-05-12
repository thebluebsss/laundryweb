import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { SelectProps, Stack, styled, Typography, Checkbox, CircularProgress } from '@mui/material';
import { SelectOptions } from './InputSelect';
import { isEmpty } from 'lodash';
import FormLabel from '@mui/material/FormLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormHelperText from '@mui/material/FormHelperText';
import { TextError } from './TextError';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const MenuProps = {
  PaperProps: {}
};

type InputSelectMultipleProps = SelectProps & {
  options: SelectOptions[];
  onChangeInput?: (value: string[]) => void;
  placeholder?: string;
  defaultValue?: string[];
  label?: string;
  inputError?: string;
  listChooseSelect: string[];
  handleFetchMore: () => void;
  hasMore?: boolean;
};

export const InputSelectMultipleInfinite = ({
  label,
  options,
  placeholder,
  onChangeInput,
  inputError,
  listChooseSelect,
  handleFetchMore,
  hasMore,
  ...rest
}: InputSelectMultipleProps) => {
  const [listChoose, setListChoose] = React.useState<string[]>([]);

  useEffect(() => {
    setListChoose(listChooseSelect);
  }, [listChooseSelect]);

  const handleChange = (value: string) => {
    let newList = [...listChoose];
    if (!newList.includes(value)) {
      newList.push(value);
    } else {
      newList = newList.filter((item) => item !== value);
    }
    onChangeInput && onChangeInput(newList);
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
              <Typography mb={1.25} color={'#818181'}>
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
                    paddingLeft: 0,
                    display: 'flex',
                    gap: 0.5,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    width: '100%',
                    cursor: rest.disabled ? 'not-allowed' : 'auto'
                  }}>
                  {(listChoose as [])?.map((value: unknown, index: number) => {
                    const selectedOption = options.find(
                      (item: SelectOptions) => value === item.value
                    );
                    if (!selectedOption) return null;
                    return (
                      <Chip
                        style={{ color: '#686868', paddingLeft: '5px' }}
                        key={index}
                        label={selectedOption.label}
                      />
                    );
                  })}
                </Box>
              );
            }}
            MenuProps={MenuProps}>
            <Stack id="scrollable-menu" sx={{ height: '300px', overflow: 'auto' }}>
              <InfiniteScroll
                dataLength={options.length}
                next={handleFetchMore}
                hasMore={!!hasMore}
                scrollableTarget="scrollable-menu"
                loader={
                  <Box p={1} textAlign="center">
                    <CircularProgress size={24} />
                  </Box>
                }>
                <MenuItem disabled value="">
                  <em>{placeholder}</em>
                </MenuItem>
                {options.map((op: SelectOptions) => (
                  <MenuItemStyled
                    onClick={() => handleChange(op.value)}
                    key={op.value}
                    value={op.value}>
                    <Stack alignItems={'center'} flexDirection={'row'} gap={0.25}>
                      <Checkbox
                        checked={listChoose.includes(op.value)}
                        onChange={(event) => handleCheckboxChange(event, op.value)}
                      />
                      <TextChildStyled>{op.label}</TextChildStyled>
                    </Stack>
                  </MenuItemStyled>
                ))}
              </InfiniteScroll>
            </Stack>
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
  height: 54,
  borderTop: `1px solid #818181`
}));

const TextChildStyled = styled(Typography)(() => ({
  lineHeight: 'normal',
  color: '#000'
}));

const SelectStyled = styled(Select)(() => ({
  height: 56,
  '&.MuiInputBase-root': {
    background: '#F8FDE9',
    borderRadius: '12px',
    outline: 'none'
  },
  '& .MuiInputBase-input': {
    backgroundColor: '#fff',
    padding: '16px 12px'
  },
  '.MuiMenu-list': {
    paddingBottom: 0
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderBottom: `1px solid #BABAB6`,
    borderRadius: 12,
    '.css-14lo706': {
      width: 0
    }
  }
}));
