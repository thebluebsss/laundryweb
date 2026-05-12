import { Stack, styled, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { ADMIN_MENU } from 'const/menu';
import { StorageServices } from 'services/storage';
import { useNavigate } from 'react-router-dom';
import { LogoutIcon } from '../../../assets';
import { useAuth } from 'contexts/auth';
import { useClinic } from 'contexts/clinic';

const storage = new StorageServices();

export const SidebarAdmin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setClinic } = useClinic();
  const handleLogout = () => {
    storage.removeAccessToken();
    storage.removeRefreshToken();
    setAuth(null);
    setClinic(null);
    navigate('/admin/login');
  };

  return (
    <WrapperSidebar>
      <Stack alignItems="center" pt={4} height="100%" justifyContent={'space-between'} flex={1}>
        <Stack width="100%" gap={'28px'} alignItems="center">
          <Stack px={3}>
            <img src="/images/logo.png" alt="Derma Care" width={88} />
          </Stack>

          <Stack width="100%">
            {ADMIN_MENU.map((item, index) => {
              const isActive = item.activeUrls?.some((url) => pathname.startsWith(url));
              return (
                <Stack flexDirection={'row'} key={index} gap={'20px'}>
                  <Stack
                    borderRadius={'0px 6px 6px 0px'}
                    bgcolor={isActive ? '#7B96AD' : 'unset'}
                    width={'6px'}
                    height={'50px'}
                  />
                  <NavLink to={item.link} style={{ textDecoration: 'none', flex: 1 }}>
                    <MenuItem className={isActive ? 'active' : ''}>
                      <Stack className="icon">{item.icon}</Stack>
                      <Typography className="label">{item.label}</Typography>
                    </MenuItem>
                  </NavLink>
                </Stack>
              );
            })}
          </Stack>
        </Stack>

        <Stack px={'36px'} width={'100%'}>
          <LogoutButton onClick={handleLogout}>
            <LogoutIcon />
            <Typography fontWeight={600}>Log Out</Typography>
          </LogoutButton>
        </Stack>
      </Stack>

      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'row'}
        gap={'4px'}
        mb={'32px'}>
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
    </WrapperSidebar>
  );
};

const WrapperSidebar = styled(Stack)(({ theme }) => ({
  width: 240,
  height: '100vh',
  backgroundColor: theme.palette.common.white,
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 20,
  gap: 50
}));

const MenuItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: '12px 7px 12px 16px',
  gap: 20,
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: theme.palette.text.secondary,

  // '&:hover': {
  //   backgroundColor: theme.colors.secondary,
  //   color: theme.colors.white,
  //   '& .icon': {
  //     color: theme.colors.white
  //   },
  //   '& .label': {
  //     fontWeight: 700,
  //     color: theme.colors.white
  //   }
  // },

  '&.active': {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.white,
    '& .icon': {
      color: theme.colors.white
    },
    '& .label': {
      fontWeight: 700,
      color: theme.colors.white
    }
  },

  '& .icon': {
    display: 'flex',
    color: '#565656'
  },

  '& .label': {
    fontSize: 14,
    fontWeight: 600,
    color: '#565656'
  }
}));

const LogoutButton = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: '12px 16px',
  gap: 16,
  borderRadius: 8,
  cursor: 'pointer',
  width: '100%',
  color: '#565656',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.error.main
  }
}));
