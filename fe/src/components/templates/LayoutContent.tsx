import { Stack, styled, Typography } from '@mui/material';
import { ButtonCustom } from '../elements/ButtonCustom';
import { ReactNode, useCallback } from 'react';
import { StorageServices } from 'services/storage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/auth';
import { useClinic } from 'contexts/clinic';
const storage = new StorageServices();

type LayoutContentProps = {
  title?: string;
  children: ReactNode;
  isBorder?: boolean;
};
export const LayoutContent = ({ title, children, isBorder }: LayoutContentProps) => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setClinic } = useClinic();

  const onLogout = useCallback(() => {
    storage.removeAccessToken();
    storage.removeRefreshToken();
    setAuth(null);
    setClinic(null);
    navigate('/login');
  }, [navigate, setAuth, setClinic]);

  return (
    <Stack width={'100%'}>
      <Stack
        width={'100%'}
        flexDirection={'row'}
        p={5}
        alignItems={'center'}
        justifyContent={'space-between'}
        borderRadius={'20px'}>
        <Typography fontSize={'36px'} fontWeight={700} color={'#2B3492'}>
          {title}
        </Typography>
        <ButtonCustom
          onClick={onLogout}
          sx={{ width: 'auto', padding: '10px 20px' }}
          label={'Logout'}
        />
      </Stack>
      <WrapperChild m={isBorder ? 5 : 0} p={isBorder ? 5 : 0} active={isBorder ? 'active' : ''}>
        {children}
      </WrapperChild>
    </Stack>
  );
};
const WrapperChild = styled(Stack)(({ active }: { active: string }) => ({
  width: active ? 'fit-content' : '100%',
  borderRadius: '30px',
  border: active ? '1px solid #ccc' : 'none',
  boxShadow: active ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
}));
