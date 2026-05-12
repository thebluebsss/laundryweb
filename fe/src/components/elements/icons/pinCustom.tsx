import React, { ReactNode } from 'react';
import { Stack, styled } from '@mui/material';

type PinCustomProp = {
  color?: string;
  icon: ReactNode;
};
export const PinCustom = ({ icon, color }: PinCustomProp) => {
  return (
    <Stack position={'relative'} width={31} height={48}>
      <svg
        width="31"
        height="49"
        viewBox="0 0 31 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.3"
          d="M15.5 48.7143C17.5382 48.7143 19.1905 47.8881 19.1905 46.869C19.1905 45.8499 17.5382 45.0238 15.5 45.0238C13.4619 45.0238 11.8096 45.8499 11.8096 46.869C11.8096 47.8881 13.4619 48.7143 15.5 48.7143Z"
          fill={color || '#545454'}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.5 0C24.0604 0 31 6.93959 31 15.5C31 23.5625 24.8442 30.1873 16.9762 30.9306V45.7619C16.9762 46.5772 16.3153 47.2381 15.5 47.2381C14.6847 47.2381 14.0238 46.5772 14.0238 45.7619V30.9306C6.15581 30.1873 0 23.5625 0 15.5C0 6.93959 6.93959 0 15.5 0Z"
          fill={color || '#545454'}
        />
        <path
          d="M28.0952 17.5476C28.0952 10.6178 22.4775 5 15.5476 5C8.61776 5 3 10.6178 3 17.5476C3 24.4775 8.61776 30.0952 15.5476 30.0952C22.4775 30.0952 28.0952 24.4775 28.0952 17.5476Z"
          fill={color || '#545454'}
        />
      </svg>
      <WrapperIcon>{icon}</WrapperIcon>
    </Stack>
  );
};
const WrapperIcon = styled(Stack)(() => ({
  width: 'fit-content',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '15px',
  left: '50%'
}));
