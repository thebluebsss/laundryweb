import { FC } from 'react';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { Stack, StackProps } from '@mui/material';

type SwitchButtonProps = {
  title?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  colorTitle?: string;
  disabled?: boolean;
} & StackProps;

export const SwitchButton: FC<SwitchButtonProps> = ({
  title,
  checked = false,
  onChange,
  colorTitle,
  disabled = false,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <FormControl fullWidth component="div">
      {title && (
        <FormLabel focused={false} component="legend">
          <Typography
            lineHeight={'20px'}
            fontSize={16}
            mb={1.25}
            fontWeight={400}
            color={colorTitle || '#161616'}>
            {title}
          </Typography>
        </FormLabel>
      )}
      <SwitchContainer
        active={checked ? 1 : 0}
        onClick={handleClick}
        sx={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        {...props}>
        <Thumb active={checked ? 1 : 0} alignItems={'center'} justifyContent={'center'}>
          <Typography fontSize={12} fontWeight={400} color={checked ? '#7B96AD' : '#9E9E9E'}>
            {checked ? 'ON' : 'OFF'}
          </Typography>
        </Thumb>
      </SwitchContainer>
    </FormControl>
  );
};

const SwitchContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: number }>(({ active }) => ({
  width: 92,
  height: 50,
  backgroundColor: active ? '#7B96AD' : '#E9E9EA',
  borderRadius: 8,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background-color 0.3s ease',
  boxSizing: 'border-box'
}));

const Thumb = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: number }>(({ active }) => ({
  width: 43,
  height: 46,
  borderRadius: 6,
  backgroundColor: '#fff',
  position: 'absolute',
  top: 2,
  left: active ? 'calc(100% - 43px - 2px)' : 2,
  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
}));
