import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface CustomRadioGroupProps {
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const CustomRadioGroup = ({
  name,
  label,
  value,
  onChange,
  options
}: CustomRadioGroupProps) => {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        style={{ justifyContent: 'space-between' }}
        row
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': { color: 'primary.main' }
                }}
              />
            }
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
