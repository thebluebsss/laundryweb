import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { InputAdornment, Menu, MenuItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { InputText } from './InputText';

export const PhoneNumberField = ({
  control,
  errors,
  watch,
  setValue,
  countryOptions,
  disabled = false,
  placeholder = 'Enter Phone Number'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Controller
      control={control}
      name="phoneNumber"
      render={({ field }) => (
        <InputText
          title="Phone Number"
          placeholder={placeholder}
          inputError={errors.phoneNumber?.message as string}
          inputProps={{ ...field, disabled }}
          startAdornment={
            <InputAdornment position="start">
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                sx={{ cursor: 'pointer' }}
                onClick={handleClick}>
                <Typography color="text.secondary" mr={1}>
                  {watch('countryCode') || '+1'}
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" color="action" />
              </Stack>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 200,
                    width: 250
                  }
                }}>
                {countryOptions.map((option: any) => (
                  <MenuItem
                    key={option.value}
                    selected={option.value === watch('countryCode')}
                    onClick={() => {
                      setValue('countryCode', option.value, {
                        shouldValidate: true
                      });
                      handleClose();
                    }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </InputAdornment>
          }
        />
      )}
    />
  );
};
