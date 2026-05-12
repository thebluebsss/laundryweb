import {
  LinearProgress,
  Stack,
  styled,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from 'contexts/loading';
import { StorageServices } from 'services/storage';
import { ArrowIcon, DashboardIcon, LogoutIcon, UserIcon } from '../../../assets';
import { TypographyIBM } from '../elements/TypographyIBM';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { useClinic } from 'contexts/clinic';
import { useAuth } from 'contexts/auth';
import { getClinicUserAlerts } from 'services/clinic-users';
import { LazyLoadImage } from '../elements/LazyLoadImage';
type LayoutProps = {
  children: ReactNode;
  title?: string;
  isBack?: boolean;
  noHeader?: boolean;
  bgColor?: string;
  showMenu?: boolean;
  styleLeft?: SxProps<Theme>;
};

const storage = new StorageServices();

const MenuIconAdd = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.83329 1.66663C3.53211 1.66663 1.66663 3.53211 1.66663 5.83329V14.1666C1.66663 16.4678 3.53211 18.3333 5.83329 18.3333H14.1666C16.4678 18.3333 18.3333 16.4678 18.3333 14.1666V5.83329C18.3333 3.53211 16.4678 1.66663 14.1666 1.66663H5.83329ZM9.99996 5.83329C10.4602 5.83329 10.8333 6.20639 10.8333 6.66663V9.16663H13.3333C13.7935 9.16663 14.1666 9.53972 14.1666 9.99996C14.1666 10.4602 13.7935 10.8333 13.3333 10.8333H10.8333V13.3333C10.8333 13.7935 10.4602 14.1666 9.99996 14.1666C9.53972 14.1666 9.16663 13.7935 9.16663 13.3333V10.8333H6.66663C6.20639 10.8333 5.83329 10.4602 5.83329 9.99996C5.83329 9.53972 6.20639 9.16663 6.66663 9.16663H9.16663V6.66663C9.16663 6.20639 9.53972 5.83329 9.99996 5.83329Z"
      fill="#7B96AD"
    />
  </svg>
);

const MenuIconDocument = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10 2.08329C10 1.85317 9.81349 1.66663 9.58337 1.66663H6.66671C4.82576 1.66663 3.33337 3.15901 3.33337 4.99996V15C3.33337 16.8409 4.82576 18.3333 6.66671 18.3333H13.3334C15.1743 18.3333 16.6667 16.8409 16.6667 15V8.74996C16.6667 8.51984 16.4802 8.33329 16.25 8.33329H14.1667C11.8655 8.33329 10 6.46781 10 4.16663V2.08329ZM16.0162 6.66663C16.2933 6.66663 16.4925 6.39907 16.3594 6.15604C16.2464 5.9497 16.1038 5.75856 15.9345 5.58922L12.7441 2.39886C12.5748 2.22951 12.3836 2.08697 12.1773 1.97396C11.9343 1.84086 11.6667 2.04 11.6667 2.31708V4.16663C11.6667 5.54734 12.786 6.66663 14.1667 6.66663H16.0162ZM7.50004 7.49996C7.0398 7.49996 6.66671 7.87305 6.66671 8.33329C6.66671 8.79353 7.0398 9.16663 7.50004 9.16663H8.33337C8.79361 9.16663 9.16671 8.79353 9.16671 8.33329C9.16671 7.87305 8.79361 7.49996 8.33337 7.49996H7.50004ZM6.66671 11.6666C6.66671 11.2064 7.0398 10.8333 7.50004 10.8333H12.5C12.9603 10.8333 13.3334 11.2064 13.3334 11.6666C13.3334 12.1269 12.9603 12.5 12.5 12.5H7.50004C7.0398 12.5 6.66671 12.1269 6.66671 11.6666ZM6.66671 15C6.66671 14.5397 7.0398 14.1666 7.50004 14.1666H12.5C12.9603 14.1666 13.3334 14.5397 13.3334 15C13.3334 15.4602 12.9603 15.8333 12.5 15.8333H7.50004C7.0398 15.8333 6.66671 15.4602 6.66671 15Z"
      fill="#7B96AD"
    />
  </svg>
);

const MenuIconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.99996 5C8.15901 5 6.66663 6.49238 6.66663 8.33333C6.66663 10.1743 8.15901 11.6667 9.99996 11.6667C11.8409 11.6667 13.3333 10.1743 13.3333 8.33333C13.3333 6.49238 11.8409 5 9.99996 5Z"
      fill="#7B96AD"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.83329 1.66663C3.53211 1.66663 1.66663 3.53211 1.66663 5.83329V14.1666C1.66663 16.4678 3.53211 18.3333 5.83329 18.3333H14.1666C16.4678 18.3333 18.3333 16.4678 18.3333 14.1666V5.83329C18.3333 3.53211 16.4678 1.66663 14.1666 1.66663H5.83329ZM3.33329 5.83329C3.33329 4.45258 4.45258 3.33329 5.83329 3.33329H14.1666C15.5473 3.33329 16.6666 4.45258 16.6666 5.83329V14.1666C16.6666 14.8906 16.3589 15.5426 15.8671 15.9992C14.7404 13.9163 12.5363 12.5 9.99977 12.5C7.46333 12.5 5.25931 13.9162 4.13252 15.999C3.6409 15.5424 3.33329 14.8904 3.33329 14.1666V5.83329Z"
      fill="#7B96AD"
    />
  </svg>
);

const MenuIconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H7.5"
      stroke="#7B96AD"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const LayoutApp = ({
  showMenu = true,
  noHeader,
  styleLeft,
  children,
  title,
  isBack,
  bgColor = '#F4F4F4'
}: LayoutProps) => {
  const { auth, setAuth } = useAuth();
  const { clinic, setClinic } = useClinic();
  const navigate = useNavigate();
  const { loading: callbackLoading } = useLoading();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [intakeAlertCount, setIntakeAlertCount] = useState<number | null>(null);

  useEffect(() => {
    if (!auth?.id) {
      setIntakeAlertCount(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getClinicUserAlerts();
        if (!cancelled) setIntakeAlertCount(data.alerts.length);
      } catch {
        if (!cancelled) setIntakeAlertCount(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth?.id]);

  const handleLogout = useCallback(() => {
    storage.removeAccessToken();
    storage.removeRefreshToken();
    setAuth(null);
    setClinic(null);
    navigate('/login');
  }, [navigate, setAuth, setClinic]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'New Client Intake', path: '/fresh-analysis', icon: <MenuIconAdd /> },
    { label: 'Client List', path: '/patient-list', icon: <MenuIconDocument /> },
    { label: 'User Profile', path: '/profile', icon: <MenuIconUser /> },
    { label: 'Terms & Conditions', path: '/terms', icon: <MenuIconDocument /> },
    { label: 'Privacy Policy', path: '/privacy', icon: <MenuIconDocument /> }
  ];

  const menuContent = (
    <Menu
      anchorEl={anchorEl}
      open={openMenu}
      onClose={handleCloseMenu}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '12px',
          minWidth: 300,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          p: 0,
          '& .MuiList-root': {
            padding: 0
          }
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      {menuItems.map((item) => (
        <Box key={item.label} borderBottom={'1px solid #EEE'}>
          <MenuItem
            onClick={() => {
              navigate(item.path);
              handleCloseMenu();
            }}
            sx={{ py: 1, px: 2.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 20, fontWeight: 400, color: '#000' }}
            />
          </MenuItem>
        </Box>
      ))}
      <MenuItem
        onClick={() => {
          handleLogout();
          handleCloseMenu();
        }}
        sx={{ py: 1, px: 2.5 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          <MenuIconLogout />
        </ListItemIcon>
        <ListItemText
          primary="Log Out"
          primaryTypographyProps={{ fontSize: 20, fontWeight: 400, color: '#000' }}
        />
      </MenuItem>
    </Menu>
  );

  return (
    <Stack
      flexDirection={'row'}
      width={'100%'}
      position={'relative'}
      sx={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        '@supports (height: 100dvh)': {
          height: '100dvh',
          maxHeight: '100dvh'
        }
      }}>
      {callbackLoading && <LinearLoading color="success" />}
      <Stack
        width={'100%'}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#fcfcfc'
        }}>
        {!noHeader && (
          <HeaderStack
            style={{ background: bgColor }}
            pl={{ xs: '16px', sm: title ? '50px' : '32px' }}
            pr={{ xs: '16px', sm: '45px' }}>
            <Stack
              maxWidth={'1100px'}
              width={'100%'}
              mx={'auto'}
              direction="row"
              alignItems="center"
              justifyContent="space-between">
              <Stack
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (isBack) {
                    navigate(-1);
                  } else {
                    navigate('/dashboard');
                  }
                }}
                direction="row"
                alignItems="center"
                gap={'28px'}
                sx={styleLeft}>
                {isBack && <ArrowIcon color={'#9B9B9B'} strokeWidth={'3px'} width={19} />}
                {title ? (
                  <TypographyIBM fontSize={{ xs: 18, sm: 20 }} fontWeight={600} color="#020202">
                    {title}
                  </TypographyIBM>
                ) : (
                  <LazyLoadImage
                    src={clinic?.logoUrl || '/images/logo.png'}
                    alt="logo"
                    effect="blur"
                    style={{ objectFit: 'cover', maxHeight: 100, width: 100 }}
                  />
                )}
                <Stack width={19} />
              </Stack>
              {showMenu && (
                <Stack direction="row" alignItems="center" gap={'20px'}>
                  <Stack
                    position={'relative'}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/intake-management')}>
                    <img src={'/icons/icon_bell_app.svg'} alt={'icon'} />
                    {intakeAlertCount != null && intakeAlertCount > 0 ? (
                      <Stack
                        position={'absolute'}
                        top={-6}
                        borderRadius={'50%'}
                        right={-8}
                        alignItems={'center'}
                        justifyContent={'center'}
                        minWidth={18}
                        height={18}
                        px={intakeAlertCount > 9 ? 0.5 : 0}
                        bgcolor={'#F00'}>
                        <TypographyIBM fontSize={10} fontWeight={800} color={'#FFF'}>
                          {intakeAlertCount > 99 ? '99+' : intakeAlertCount}
                        </TypographyIBM>
                      </Stack>
                    ) : null}
                  </Stack>
                  <Stack>
                    <TypographyIBM fontSize={26} fontWeight={700}>
                      {auth?.firstName} {auth?.lastName}
                    </TypographyIBM>
                  </Stack>
                  {/* Menu Button */}
                  <IconButton onClick={handleOpenMenu} sx={{ zIndex: 1300 }}>
                    <img src="/icons/icon_menu.svg" alt="menu" />
                  </IconButton>
                  {menuContent}
                </Stack>
              )}
            </Stack>
          </HeaderStack>
        )}

        <ContentStack style={{ background: bgColor }}>
          <Stack maxWidth={'1100px'} mx={'auto'} width={'100%'}>
            {children}
          </Stack>
        </ContentStack>
        <FooterAppWrapper>
          <Stack mx={'auto'} width={'100%'}>
            <FooterApp bgColor={bgColor} />
          </Stack>
        </FooterAppWrapper>
      </Stack>
    </Stack>
  );
};

const FooterApp = ({ bgColor }: { bgColor: string }) => (
  <Stack
    alignItems={'center'}
    justifyContent={'center'}
    flexDirection={'row'}
    style={{ background: bgColor }}
    gap={'4px'}
    pt={2.5}
    pb={1.5}
    width={'100%'}>
    <TypographyIBM
      variant="caption"
      color="text.primary"
      lineHeight={'16px'}
      fontSize={{ xs: 12 }}
      fontWeight={400}
      letterSpacing={1}>
      POWERED BY
    </TypographyIBM>
    <img style={{ width: 60 }} src={'/icons/icon_text.svg'} alt={'icon-text'} />
  </Stack>
);

const HeaderStack = styled(Stack)(({ theme }) => ({
  height: '120px',
  position: 'sticky',
  justifyContent: 'center',
  top: 0,
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    minHeight: '60px',
    marginTop: 0,
    paddingTop: '10px',
    paddingBottom: '10px'
  }
}));

const ContentStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  padding: '32px',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  [theme.breakpoints.down('sm')]: {
    padding: '0 20px',
    paddingTop: '20px'
  }
}));

const FooterAppWrapper = styled(Stack)(() => ({
  background: '#fff',
  position: 'sticky',
  bottom: 0,
  zIndex: 10
}));

const LinearLoading = styled(LinearProgress)(() => ({
  position: 'fixed',
  width: '100vw',
  zIndex: 1000
}));
