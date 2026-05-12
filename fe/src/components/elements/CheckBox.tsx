import { FormControlLabel, IconButton, Typography } from '@mui/material';

export interface CheckboxProps {
  checked: boolean;
  onCheck: (nextChecked: boolean) => void;
  label?: string;
}

export const CheckboxCustom: React.FC<CheckboxProps> = ({ checked, onCheck, label }) => {
  const icon = (
    <IconButton
      size="small"
      disableRipple
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheck(!checked);
      }}
      sx={{
        p: 0,
        borderRadius: 0,
        color: 'inherit',
        '&:hover': { bgcolor: 'transparent' }
      }}>
      {checked ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#7B96AD" stroke="#7B96AD" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.7665 6.24736C16.0778 6.57716 16.0778 7.11189 15.7665 7.4417L9.00079 14.6077C8.98662 14.6228 8.97204 14.6371 8.9571 14.6507C8.93266 14.6864 8.90527 14.7205 8.87492 14.7526C8.56354 15.0825 8.05869 15.0825 7.74731 14.7526L4.23354 11.0309C3.92215 10.7011 3.92215 10.1664 4.23354 9.8366C4.54492 9.50679 5.04977 9.50679 5.36115 9.8366L8.30565 12.9553L14.6389 6.24736C14.9502 5.91755 15.4551 5.91755 15.7665 6.24736Z"
            fill="white"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#7B96AD" />
        </svg>
      )}
    </IconButton>
  );

  if (!label) {
    return icon;
  }

  return (
    <FormControlLabel
      control={icon}
      sx={{ m: 0, alignItems: 'center' }}
      label={
        <Typography fontSize={15} fontWeight={900} color="primary.main">
          {label}
        </Typography>
      }
    />
  );
};
