import { Stack, styled } from '@mui/material';
import { ReactNode } from 'react';

type CircleIconProps = {
  icon: ReactNode;
  color?: string;
};

export const CircleIcon = ({ icon, color }: CircleIconProps) => {
  return (
    <Wrapper sx={{ background: color || '#545454' }}>
      <WrapperIcon>{icon}</WrapperIcon>
    </Wrapper>
  );
};

const Wrapper = styled(Stack)(() => ({
  width: 31,
  height: 31,
  borderRadius: '50%',
  position: 'relative'
}));
const WrapperIcon = styled(Stack)(() => ({
  width: 'fit-content',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%'
}));
