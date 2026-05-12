import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type LayoutAuthProps = {
  children: ReactNode;
  title?: string;
  subTitle?: string;
};

export const LayoutAuth = ({
  children,
  title,
  isAdmin
}: LayoutAuthProps & { isAdmin?: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'));

  if (!isAdmin) {
    return (
      <Stack minHeight="100vh" width="100%" bgcolor="common.white" alignItems="center">
        {/* Logo Section */}
        <Stack pt={'80px'} alignItems="center">
          <img src="/images/logo.png" alt="Derma Care" width={isMobile ? 178 : 298} />
        </Stack>
        {/* Content Section */}
        <Stack mt={'100px'} width="100%" maxWidth={410} alignItems={'center'}>
          <Stack width={'100%'} px={2.5}>
            {title && (
              <Typography
                mb={'36px'}
                fontSize={27}
                fontWeight={500}
                lineHeight={'33px'}
                textAlign="center">
                {title}
              </Typography>
            )}
            {children}
          </Stack>
        </Stack>
        {/* Footer Section */}
        <Stack
          mt="auto"
          pb={'30px'}
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'row'}
          gap={'4px'}>
          <Typography
            variant="caption"
            color="text.primary"
            lineHeight={'16px'}
            fontSize={14}
            fontWeight={400}
            letterSpacing={1}>
            POWERED BY
          </Typography>
          <img style={{ width: 92 }} src={'/icons/icon_text.svg'} alt={'icon-text'} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack flexDirection={'row'} minHeight="100vh" width="100%" bgcolor="common.white">
      <Stack
        flexDirection={{ xs: 'column', xl: 'row' }}
        alignItems="center"
        justifyContent="center"
        position="relative"
        width={'100%'}
        gap={{ xs: '67px', xl: '200px' }}>
        <Stack alignItems="center" gap={'100px'}>
          <img src="/images/logo.png" alt="Derma Care" width={isMobile ? 178 : 298} />
          {isAdmin && (
            <Typography
              display={{ xs: 'none', xl: 'block' }}
              fontWeight={600}
              color="text.primary"
              textAlign="center"
              fontSize={{ xs: 24, xl: 36 }}>
              Admin Portal
            </Typography>
          )}
        </Stack>
        <Stack
          width="100%"
          maxWidth={{ xs: 410, xl: 584 }}
          alignItems={'center'}
          position={'relative'}>
          <Stack
            mt={{ xs: '0', xl: '55px' }}
            minHeight={465}
            width={'100%'}
            px={{ xs: 2.5, xl: '87px' }}
            py={{ xs: 2.5, xl: '50px' }}
            bgcolor={{ xs: 'transparent', xl: 'background.paper' }}
            borderRadius={2}>
            {title && (
              <Typography
                mb={{ xs: '36px', xl: '0' }}
                fontSize={27}
                fontWeight={500}
                lineHeight={'33px'}
                textAlign="center">
                {title}
              </Typography>
            )}
            {children}
          </Stack>
          <Stack
            position={'absolute'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'row'}
            gap={'4px'}
            bottom={'-78px'}>
            <Typography
              variant="caption"
              color="text.primary"
              lineHeight={'16px'}
              fontSize={{ xs: 13, xl: 14 }}
              fontWeight={400}
              letterSpacing={1}>
              POWERED BY
            </Typography>
            <img style={{ width: 92 }} src={'/icons/icon_text.svg'} alt={'icon-text'} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
