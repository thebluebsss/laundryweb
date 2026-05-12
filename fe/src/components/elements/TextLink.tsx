import { Typography, TypographyProps } from '@mui/material';
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type TextLinkProps = TypographyProps & {
  children?: ReactNode;
  to?: string;
  target?: string;
};

export const TextLink: FC<TextLinkProps> = ({ children, to, sx, target, ...props }) => {
  const content = (
    <Typography
      sx={{
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        color: '#7B96AD',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        },
        ...sx
      }}
      {...props}>
      {children}
    </Typography>
  );

  if (to) {
    const isExternal = to.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={to}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          style={{ textDecoration: 'none' }}>
          {content}
        </a>
      );
    }
    return (
      <Link to={to} target={target} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
};
