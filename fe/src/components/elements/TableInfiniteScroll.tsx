import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  styled,
  Stack,
  Typography
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { Fragment, ReactNode } from 'react';
import { IconFilter } from 'assets';
import { IconSortCustom } from './icons/IconSortCustom';

export type PrimaryTableHeader = {
  label: ReactNode;
  width?: number | string;
  isHide?: boolean;
  sort?: string;
  onClick?: (index: number) => void;
};
export type TableDataType = Record<string, CellDataType>;
export type CellDataType = {
  value: ReactNode;
  isHide?: boolean;
};
type TableInfiniteScrollProps = {
  data: TableDataType[];
  handleFetchMore: () => void;
  headers: PrimaryTableHeader[];
  hasMore: boolean;
  handleChooseRow: (indexRow: number) => void;
  idElementScroll?: string;
  infoStickies?: { index: number; leftSpace: number; isBorder?: boolean }[];
  styledTableRow?: React.CSSProperties;
  onSortHeader?: (sortField: string) => void;
  sort?: {
    field: string;
    order: string;
  };
};
export const TableInfiniteScroll = ({
  data,
  handleFetchMore,
  headers,
  hasMore,
  handleChooseRow,
  idElementScroll,
  infoStickies,
  styledTableRow,
  onSortHeader,
  sort
}: TableInfiniteScrollProps) => {
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={handleFetchMore}
      hasMore={hasMore}
      scrollableTarget={idElementScroll}
      loader={
        <Box p={1}>
          <CircularProgress />
        </Box>
      }>
      <TableContainer>
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {headers.map((header: PrimaryTableHeader, index: number) => {
                const infoSticky = infoStickies?.find((item) => item.index === index);
                return (
                  <Fragment key={index}>
                    {!header.isHide && (
                      <Fragment>
                        {infoSticky ? (
                          <TableCellHeaderStyled
                            onClick={() => {
                              if (!header.sort) return;
                              onSortHeader && onSortHeader(header.sort);
                            }}
                            sx={{
                              position: 'sticky',
                              backgroundColor: '#fff',
                              left: infoSticky.leftSpace,
                              cursor: 'pointer'
                            }}
                            width={header.width}
                            key={index}>
                            <Stack
                              style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: '10px',
                                cursor: header.sort ? 'pointer' : 'unset'
                              }}>
                              <TitleHeaderStyled>{header.label}</TitleHeaderStyled>
                              {header.sort && (
                                <Stack
                                  style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: '4px'
                                  }}>
                                  <IconSortCustom
                                    order={sort?.field === header.sort ? sort?.order : ''}
                                  />
                                  <IconFilter
                                    color={sort?.field === header.sort ? '#818181' : '#D2D2D2'}
                                  />
                                </Stack>
                              )}
                            </Stack>
                          </TableCellHeaderStyled>
                        ) : (
                          <TableCellHeaderStyled
                            width={header.width}
                            key={index}
                            onClick={() => {
                              if (!header.sort) return;
                              onSortHeader && onSortHeader(header.sort);
                            }}>
                            <Stack
                              style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: '10px',
                                cursor: header.sort ? 'pointer' : 'unset'
                              }}>
                              <TitleHeaderStyled>{header.label}</TitleHeaderStyled>
                              {header.sort && (
                                <Stack
                                  style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: '4px'
                                  }}>
                                  <IconSortCustom
                                    order={sort?.field === header.sort ? sort?.order : ''}
                                  />
                                  <IconFilter
                                    color={sort?.field === header.sort ? '#818181' : '#D2D2D2'}
                                  />
                                </Stack>
                              )}
                            </Stack>
                          </TableCellHeaderStyled>
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: TableDataType, rowIndex: number) => (
              <TableRowStyled
                sx={{
                  backgroundColor: rowIndex % 2 === 0 ? '#F9F9F9' : '#fff'
                }}
                style={styledTableRow}
                key={rowIndex}
                onClick={() => handleChooseRow(rowIndex)}>
                {Object.values(row).map((record: CellDataType, colIndex: number) => {
                  const infoSticky = infoStickies?.find((item) => item.index === colIndex);
                  return (
                    <Fragment key={colIndex}>
                      {!record.isHide && (
                        <Fragment>
                          {infoSticky ? (
                            <TableCellStyled
                              sx={{
                                position: 'sticky',
                                backgroundColor: '#E3EEF9',
                                left: infoSticky.leftSpace
                              }}>
                              {record.value}
                            </TableCellStyled>
                          ) : (
                            <TableCellStyled>{record.value}</TableCellStyled>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  );
                })}
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </InfiniteScroll>
  );
};

const TableRowStyled = styled(TableRow)(() => ({
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));
const TableCellStyled = styled(TableCell)(() => ({
  padding: '14px 8px',
  borderColor: '#F2F2F2'
}));
const TableCellHeaderStyled = styled(TableCell)(() => ({
  padding: '14px 8px',
  cursor: 'pointer',
  borderColor: '#F2F2F2',
  '&:hover': {
    opacity: 0.8
  }
}));
const TitleHeaderStyled = styled(Typography)(() => ({
  color: '#818181',
  fontFamily: `'Nunito Sans',sans-serif`,
  fontSize: '12px',
  fontWeight: 700
}));
