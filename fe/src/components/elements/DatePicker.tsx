import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as BasicDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { SxProps, Theme } from '@mui/material/styles';
import { Stack, styled, InputAdornment, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { TextError } from './TextError';
import FormHelperText from '@mui/material/FormHelperText';
import { DateView } from '@mui/x-date-pickers';
import FormControl from '@mui/material/FormControl';

type ValueFormatter = (date: Dayjs) => string;

type DatePickerProps = {
  startDate?: Dayjs;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  endDate?: Dayjs;
  value?: Dayjs;
  title?: string;
  inputError?: string;
  disabled?: boolean;
  colorTitle?: string;
  required?: boolean;
  openTo?: DateView;
  views?: DateView[];
  onChange?: (val: Dayjs | null) => void;
  format?: string;
  formatInputValue?: ValueFormatter;
  isAuthScreen?: boolean;
  inputSx?: SxProps<Theme>;
  placeholder?: string;
  positionIcon?: 'start' | 'end';
};

export const DatePickerCustom = ({
  value,
  onChange,
  disabled,
  title,
  inputError,
  minDate,
  maxDate,
  colorTitle,
  openTo,
  views,
  isAuthScreen,
  required,
  format,
  formatInputValue,
  inputSx,
  positionIcon = 'end',
  placeholder
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);

  const formatInputValueRef = React.useRef(formatInputValue);
  formatInputValueRef.current = formatInputValue;
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const textFieldSlotForFormattedInput = React.useMemo(
    () => ({
      textField: (params: TextFieldProps) => {
        const fmt = formatInputValueRef.current;
        const v = valueRef.current;
        if (!fmt) {
          return <TextField {...params} />;
        }
        const display = v != null && dayjs(v).isValid() ? fmt(dayjs(v)) : '';
        return (
          <TextField
            {...params}
            value={display}
            inputProps={{
              style: {
                fontSize: 16
              },
              ...params.inputProps,
              readOnly: true
            }}
          />
        );
      }
    }),
    []
  );

  const slots = formatInputValue ? textFieldSlotForFormattedInput : undefined;

  return (
    <FormControl fullWidth error={!!inputError} required={required}>
      <Stack
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px'
          },
          '.MuiStack-root': {
            paddingTop: '0px'
          }
        }}>
        <StyleLocalizationProvider dateAdapter={AdapterDayjs}>
          {title && (
            <FormLabel>
              <Typography
                sx={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                lineHeight={isAuthScreen ? '16px' : '20px'}
                fontSize={isAuthScreen ? 14 : 16}
                mb={1.25}
                fontWeight={isAuthScreen ? 500 : 400}
                color={colorTitle || isAuthScreen ? 'text.secondary' : '#161616'}>
                {title}
                {required && <span style={{ color: '#ED2121' }}> *</span>}
              </Typography>
            </FormLabel>
          )}
          <DemoContainer
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', minWidth: '100px' }}
            components={['DatePicker']}>
            <StyledDatePicker
              disabled={disabled}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              slots={slots}
              slotProps={{
                openPickerButton: {
                  sx: { display: 'none' }
                },
                textField: {
                  error: !!inputError,
                  placeholder,
                  sx: { ...inputSx },
                  InputProps: {
                    startAdornment:
                      positionIcon === 'start' ? (
                        <InputAdornment position="start">
                          <img
                            src="/icons/calendar.svg"
                            alt="calendar"
                            role="button"
                            aria-label="Open date picker"
                            onClick={() => !disabled && setOpen(true)}
                            style={{
                              width: 20,
                              height: 20,
                              cursor: disabled ? 'not-allowed' : 'pointer'
                            }}
                          />
                        </InputAdornment>
                      ) : (
                        <></>
                      ),
                    endAdornment:
                      positionIcon === 'end' ? (
                        <InputAdornment position="end">
                          <img
                            src="/icons/calendar-end.svg"
                            alt="calendar"
                            role="button"
                            aria-label="Open date picker"
                            onClick={() => !disabled && setOpen(true)}
                            style={{
                              width: 20,
                              height: 20,
                              cursor: disabled ? 'not-allowed' : 'pointer'
                            }}
                          />
                        </InputAdornment>
                      ) : (
                        <></>
                      )
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: `1px solid #7B96AD ${inputError ? '' : ' !important'}`,
                  borderColor: '#7B96AD'
                }
              }}
              format={formatInputValue ? 'D MMMM YYYY' : format}
              openTo={openTo}
              views={views}
              minDate={minDate}
              maxDate={maxDate}
              value={value ?? null}
              onChange={(val) => {
                if (!onChange) return;
                if (!dayjs(val).isValid()) {
                  onChange(null);
                } else {
                  onChange(val);
                }
              }}
            />
          </DemoContainer>
          {inputError && (
            <FormHelperText error={!!inputError} sx={{ ml: 0, pt: 0.5, maxWidth: '100%' }}>
              <TextError errorText={inputError} />
            </FormHelperText>
          )}
        </StyleLocalizationProvider>
      </Stack>
    </FormControl>
  );
};

const StyledDatePicker = styled(BasicDatePicker, {
  shouldForwardProp: (prop) => prop !== 'isLarge'
})(() => ({
  width: '100%',
  minWidth: '100px !important',
  '& .MuiInputBase-root': {
    height: 50,
    borderRadius: '10px'
  },
  '& .MuiOutlinedInput-input': {
    padding: 0
  },
  '& .MuiTextField-root': {
    minWidth: '100px !important'
  },
  '& .MuiInputAdornment-positionStart': {
    marginRight: 8
  },
  '& .MuiInputAdornment-root': {
    marginLeft: '4px'
  },
  '& .MuiSvgIcon-root': {
    display: 'none'
  }
}));
const StyleLocalizationProvider = styled(LocalizationProvider)(() => ({
  width: '100%'
}));
