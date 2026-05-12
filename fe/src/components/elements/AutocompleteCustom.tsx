import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

export interface AutocompleteCustomFreeSoloProps {
  options: { label: string; value: string }[];
  value: { label: string; value: string } | null;
  onChange: (value: { label: string; value: string } | null) => void;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
}

export const AutocompleteCustomFreeSolo: React.FC<AutocompleteCustomFreeSoloProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  loading,
  error,
  helperText
}) => {
  return (
    <StyledFormControl>
      {label && (
        <FormLabel>
          <Typography mb={1.25} fontWeight={600} color="primary.main">
            {label}
          </Typography>
        </FormLabel>
      )}
      <Autocomplete
        options={options}
        value={value}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            onChange({ label: newValue, value: newValue });
          } else if (newValue && typeof newValue === 'object') {
            onChange(newValue);
          } else {
            onChange(null);
          }
        }}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        loading={loading}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            style={{
              backgroundColor: selected ? '#e3f2fd' : 'white',
              fontWeight: selected ? 'bold' : 'normal'
            }}>
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} error={error} helperText={helperText} />
        )}
      />
    </StyledFormControl>
  );
};
const StyledFormControl = styled(FormControl)(() => ({
  '& .MuiAutocomplete-popper': {
    zIndex: 'unset'
  },
  '.MuiInputLabel-outlined.Mui-focused': {
    display: 'none'
  },
  '.MuiInputLabel-outlined.MuiFormLabel-filled': {
    display: 'none'
  },
  '.MuiInputLabel-outlined': {
    fontSize: '16px',
    marginBottom: '8px',
    opacity: '0.6',
    top: '-5px'
  },
  '& fieldset': {
    borderWidth: '1px',
    top: 0,
    '& legend': {
      display: 'none'
    }
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    height: '56px',
    paddingTop: '8px !important'
  },
  '& .MuiAutocomplete-root': {
    width: '100%'
  }
}));
