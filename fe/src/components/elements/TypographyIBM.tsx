import { Typography, TypographyProps, styled } from '@mui/material';
export const TypographyIBM = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: theme.typography.fontFamilySecondary
}));
