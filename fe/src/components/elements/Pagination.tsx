import * as React from 'react';
import { Stack, Typography, styled } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type CustomPaginationProps = {
  page: number;
  count: number;
  onChangePage: (value: number) => void;
};

export const CustomPagination = ({ page, count, onChangePage }: CustomPaginationProps) => {
  const pageCount = Number(count);
  if (!Number.isFinite(pageCount) || pageCount < 1) {
    return null;
  }

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1.25}>
      <PaginationButton
        onClick={() => {
          if (page > 1) {
            onChangePage(page - 1);
          }
        }}
        disabled={page === 1}>
        <ArrowBackIosNewIcon sx={{ fontSize: 12, color: '#565656' }} />
      </PaginationButton>
      <Typography fontSize={12} color="#565656" fontWeight={400}>
        {page} of {pageCount} Pages
      </Typography>
      <PaginationButton
        onClick={() => {
          if (page < pageCount) {
            onChangePage(page + 1);
          }
        }}
        disabled={page === pageCount}>
        <ArrowForwardIosIcon sx={{ fontSize: 12, color: '#565656' }} />
      </PaginationButton>
    </Stack>
  );
};

const PaginationButton = styled(Stack)<{ disabled?: boolean }>(({ disabled }) => ({
  width: 24,
  height: 24,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'default' : 'pointer',
  color: disabled ? '#A0A0A0' : '#565656',
  '&:hover': {
    color: disabled ? '#A0A0A0' : '#161616'
  }
}));
