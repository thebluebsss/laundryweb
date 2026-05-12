import { FC, ReactElement } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonProps } from '@mui/material/Button';

export interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  loadingPosition?: 'start' | 'end' | 'center';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (value?: any) => void;
  children?: ReactElement | string;
}

/**
 * This component will handle all form submition
 * Mandatory props: disabled, loading, onClick, react children
 * @param children
 * @param restProps
 * @returns Component SubmitButton Element
 */
export const SubmitButton: FC<SubmitButtonProps> = ({ children, ...props }): ReactElement => {
  return (
    <LoadingButton {...props} type={props.type || 'submit'}>
      {children}
    </LoadingButton>
  );
};
