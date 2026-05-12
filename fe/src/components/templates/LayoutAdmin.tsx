import { LinearProgress, Stack, styled } from '@mui/material';
import { ReactNode } from 'react';
import { useLoading } from 'contexts/loading';
import { AdminListSearchProvider } from 'contexts/adminListSearch';
import { SidebarAdmin } from '../organisms/SidebarAdmin';
import { HeaderAdmin } from '../organisms/HeaderAdmin';

type LayoutProps = {
  children: ReactNode;
};

export const LayoutAdmin = ({ children }: LayoutProps) => {
  const { loading: callbackLoading } = useLoading();
  return (
    <AdminListSearchProvider>
      <Stack minHeight={'100vh'} flexDirection={'row'} gap={'20px'}>
        {callbackLoading && <LinearLoading color="success" />}

        <SidebarAdmin />

        <MainContent>
          <HeaderAdmin />
          <ContentWrapper>{children}</ContentWrapper>
        </MainContent>
      </Stack>
    </AdminListSearchProvider>
  );
};

const LinearLoading = styled(LinearProgress)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 2000
}));

const MainContent = styled(Stack)(({ theme }) => ({
  marginLeft: 260,
  width: 'calc(100% - 260px)',
  height: '100vh',
  overflow: 'hidden',
  gap: '30px',
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column'
}));

const ContentWrapper = styled(Stack)(() => ({
  paddingRight: '20px',
  marginBottom: '24px',
  flex: 1,
  overflowY: 'auto'
}));
