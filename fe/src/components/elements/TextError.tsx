import { Typography, TypographyProps } from '@mui/material';
type TextErrorProps = TypographyProps & {
  errorText: string;
};
export const TextError = ({ errorText, ...props }: TextErrorProps) => {
  return (
    <Typography color="#FF8D8D" fontSize={'16px'} fontWeight="normal" {...props}>
      {errorText}
    </Typography>
  );
};
