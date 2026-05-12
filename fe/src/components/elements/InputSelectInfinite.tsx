import React, { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import { TextError } from './TextError';
import { ensureSelectOptionsIncludeValue } from './InputSelect';
import { Box, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

export type SelectOptions = {
  value: string;
  label: string;
  extra?: string | ReactNode;
  extraBefore?: string | ReactNode;
  url?: string;
  color?: string;
};

type InputSelectProps = SelectProps & {
  title?: string;
  value?: string | null;
  options: SelectOptions[];
  onChange?: (e: SelectChangeEvent<unknown>) => void;
  onClose?: () => void;
  inputError?: string;
  placeholder?: string;
  defaultValue?: number | string;
  colorTitle?: string;
  handleFetchMore: () => void;
  hasMore: boolean;
  onClickOption: (value: string) => void;
};
/**
 * @returns Element InputSelect
 */
export const InputSelectInfinite: FC<InputSelectProps> = ({
  title,
  value,
  options,
  onChange,
  onClose,
  required = false,
  inputError,
  placeholder,
  defaultValue,
  colorTitle,
  handleFetchMore,
  hasMore,
  onClickOption,
  ...rest
}) => {
  const menuScrollId = React.useId().replace(/:/g, '');
  const mergedOptions = ensureSelectOptionsIncludeValue(options, value);
  return (
    <FormControl fullWidth error={!!inputError} required={required}>
      {title && (
        <FormLabel>
          <Typography
            sx={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
            lineHeight="20px"
            fontSize={16}
            mb={1.25}
            fontWeight={400}
            color={colorTitle || '#161616'}>
            {title}
          </Typography>
        </FormLabel>
      )}
      <SelectStyled
        {...rest}
        displayEmpty
        fullWidth
        defaultValue={defaultValue || ''}
        IconComponent={ExpandMoreIcon}
        renderValue={
          !value && placeholder
            ? () => (
                <MenuItem style={{ padding: 0, color: '#161616', fontSize: 16 }} disabled value="">
                  <em style={{ fontStyle: 'normal' }}>{placeholder}</em>
                </MenuItem>
              )
            : () => (
                <MenuItem style={{ padding: 0, background: 'transparent' }}>
                  <TextStyled fontSize={16}>
                    {mergedOptions.find((item) => item.value === value)?.label || ''}
                  </TextStyled>
                </MenuItem>
              )
        }
        value={value || ''}
        variant="outlined"
        onChange={onChange}
        onClose={() => {
          if (onClose) onClose();
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400
            }
          }
        }}>
        <Stack id={menuScrollId} sx={{ maxHeight: 320, overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={mergedOptions.length}
            next={handleFetchMore}
            hasMore={hasMore}
            scrollableTarget={menuScrollId}
            loader={
              <Box p={1}>
                <CircularProgress />
              </Box>
            }>
            <MenuItem value="" style={{ background: 'transparent', height: '40px' }}>
              <em
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#16161666',
                  fontStyle: 'normal'
                }}>
                {placeholder}
              </em>
            </MenuItem>
            {mergedOptions.map((op: SelectOptions, index: number) => (
              <MenuItemStyled
                selected={op.value === value}
                key={index}
                onClick={() => onClickOption(op.value)}>
                <Stack
                  width={'100%'}
                  alignItems={'center'}
                  justifyContent={op.extra ? 'space-between' : 'flex-start'}
                  flexDirection={'row'}>
                  {op.extraBefore && op.extraBefore}
                  <TextStyled fontSize={16}>{op.label}</TextStyled>
                  {op.extra && (
                    <Typography color="text.primary" width={'max-content'}>
                      {op.extra}
                    </Typography>
                  )}
                </Stack>
              </MenuItemStyled>
            ))}
          </InfiniteScroll>
        </Stack>
      </SelectStyled>
      {inputError && (
        <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
          <TextError errorText={inputError} />
        </FormHelperText>
      )}
    </FormControl>
  );
};

const SelectStyled = styled(Select)(() => ({
  minHeight: 44,
  height: 50,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '10px 12px'
  },
  '& .MuiMenu-list': {
    paddingBottom: 0
  },
  '.MuiOutlinedInput-notchedOutline': {
    border: `1px solid #7B96AD`,
    borderRadius: 10
  },
  borderRadius: '12px'
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  height: 50
}));

const TextStyled = styled(Typography)(() => ({
  width: 'max-content',
  maxWidth: 'max-content',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));
