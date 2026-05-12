import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  Stack,
  Typography,
  Checkbox as MUICheckbox
} from '@mui/material';
import React, { Fragment, ReactNode } from 'react';
import { IconFilter } from 'assets';
import { IconSortCustom } from './icons/IconSortCustom';
import { CustomPagination } from './Pagination';
import { PagingInfo } from 'types/paging';

export type PrimaryTableHeader = {
  label: ReactNode;
  width?: number | string;
  minWidth?: number | string;
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
  headers: PrimaryTableHeader[];
  handleChooseRow: (indexRow: number) => void;
  infoStickies?: { index: number; leftSpace: number; isBorder?: boolean }[];
  styledTableRow?: React.CSSProperties;
  onSortHeader?: (sortField: string) => void;
  sort?: {
    field?: string;
    order?: string;
  };
  pagingInfo?: PagingInfo;
  handleChangePage?: (value: number) => void;
  isScrollX?: boolean;
  contentExtra?: ReactNode;
  indexRowShowExtra?: number;
  isSelectRow?: boolean;
  selectAll?: boolean;
  changeSelectAll?: (value: boolean) => void;
};
export const TableCustom = ({
  data,
  headers,
  handleChooseRow,
  infoStickies,
  styledTableRow,
  onSortHeader,
  sort,
  pagingInfo,
  handleChangePage,
  isScrollX,
  contentExtra,
  indexRowShowExtra,
  isSelectRow,
  selectAll,
  changeSelectAll
}: TableInfiniteScrollProps) => {
  return (
    <Stack width={'100%'}>
      <Stack width={'100%'} style={{ overflowX: isScrollX ? 'scroll' : 'unset' }}>
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {isSelectRow && (
                <TableCell style={{ padding: '8px' }} width={'60px'}>
                  <MUICheckbox
                    checked={selectAll}
                    onChange={(e) => {
                      changeSelectAll && changeSelectAll(e.target.checked as boolean);
                    }}
                    color="primary"
                  />
                </TableCell>
              )}
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
                              backgroundColor: 'background.paper',
                              left: infoSticky.leftSpace,
                              cursor: 'pointer',
                              maxWidth: header.minWidth || 'unset'
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
              <Fragment key={rowIndex}>
                <TableRowStyled
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? 'grey.50' : 'background.paper'
                  }}
                  style={styledTableRow}
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
                                  backgroundColor: 'info.light',
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
                {rowIndex === indexRowShowExtra && (
                  <TableRow>
                    <TableCell colSpan={headers.length}>{contentExtra && contentExtra}</TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Stack>
      {pagingInfo &&
        handleChangePage &&
        Number.isFinite(Number(pagingInfo.pageCount)) &&
        Number(pagingInfo.pageCount) >= 1 && (
          <Stack
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent={'center'}
            width={'100%'}
            alignItems={'center'}
            gap={{ xs: 2, md: 'unset' }}
            pt={2.5}>
            <CustomPagination
              page={pagingInfo.currentPage}
              count={pagingInfo.pageCount}
              onChangePage={handleChangePage}
            />
          </Stack>
        )}
    </Stack>
  );
};

const TableRowStyled = styled(TableRow)(() => ({
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));
const TableCellStyled = styled(TableCell)(({ theme }) => ({
  padding: '14px 8px'
}));
const TableCellHeaderStyled = styled(TableCell)(({ theme }) => ({
  padding: '14px 8px',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}));
const TitleHeaderStyled = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '12px',
  fontWeight: 700
}));
