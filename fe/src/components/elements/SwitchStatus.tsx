import { Box, FormControl, FormLabel, Stack, styled, Typography } from '@mui/material';
import { FC } from 'react';

export type SwitchStatusOption = {
  label: string;
  value: string;
};

type SwitchStatusProps = {
  title?: string;
  value?: string;
  options: SwitchStatusOption[];
  onChange?: (value: string) => void;
  colorTitle?: string;
  itemWidth?: number | string;
};

export const SwitchStatus: FC<SwitchStatusProps> = ({
  title,
  value,
  options,
  onChange,
  colorTitle,
  itemWidth
}) => {
  const currentIndex = options.findIndex((opt) => opt.value === value);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <FormControl component="div" sx={{ width: itemWidth ? 'fit-content' : '100%' }}>
      {title && (
        <FormLabel focused={false} component="legend">
          <Typography
            lineHeight={'20px'}
            fontSize={16}
            mb={1.25}
            fontWeight={400}
            color={colorTitle || '#161616'}>
            {title}
          </Typography>
        </FormLabel>
      )}
      <Container itemWidth={itemWidth} total={options.length}>
        <Thumb index={activeIndex} total={options.length} itemWidth={itemWidth} />
        <LabelWrapper direction="row">
          {options.map((item, index) => (
            <LabelItem
              key={item.value}
              active={activeIndex === index}
              itemWidth={itemWidth}
              onClick={() => onChange?.(item.value)}>
              <Typography whiteSpace={'pre-line'} fontSize={12}>
                {item.label}
              </Typography>
            </LabelItem>
          ))}
        </LabelWrapper>
      </Container>
    </FormControl>
  );
};

const Container = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'itemWidth' && prop !== 'total'
})<{ itemWidth?: number | string; total: number }>(({ itemWidth, total }) => ({
  width: itemWidth
    ? `calc(${typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth} * ${total})`
    : '100%',
  height: 50,
  backgroundColor: '#7B96AD',
  borderRadius: 8,
  cursor: 'pointer',
  position: 'relative',
  transition: 'background-color 0.3s ease',
  boxSizing: 'border-box',
  padding: '0 4px'
}));

const Thumb = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'index' && prop !== 'total' && prop !== 'itemWidth'
})<{ index: number; total: number; itemWidth?: number | string }>(({ index, total, itemWidth }) => {
  const w = itemWidth
    ? typeof itemWidth === 'number'
      ? `${itemWidth}px`
      : itemWidth
    : `${100 / total}%`;
  const offset = itemWidth
    ? `calc(${index} * (${typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth}) + 2px)`
    : `calc(${index * (100 / total)}% + 2px)`;
  return {
    width: `calc(${w} - 4px)`,
    height: 46,
    borderRadius: 8,
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 2,
    left: offset,
    transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: 1
  };
});

const LabelWrapper = styled(Stack)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 2
}));

const LabelItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'itemWidth'
})<{ active: boolean; itemWidth?: number | string }>(({ active, itemWidth }) => ({
  flex: itemWidth ? 'none' : 1,
  width: itemWidth ? (typeof itemWidth === 'number' ? `${itemWidth}px` : itemWidth) : undefined,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 400,
  color: active ? '#7B96AD' : 'rgba(255, 255, 255, 0.75)',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  zIndex: 3,
  userSelect: 'none'
}));
