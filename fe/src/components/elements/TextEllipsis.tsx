import { Button, Typography, Tooltip } from '@mui/material';
import React, { useRef, useEffect, useState } from 'react';

type TextEllipsisProps = {
  text: string;
  width: string;
  styles?: React.CSSProperties;
  line?: number;
  onClick?: () => void;
};

export const TextEllipsis = ({ text, width, styles, line = 1, onClick }: TextEllipsisProps) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // For multiline ellipsis, compare scrollHeight and clientHeight
    if (el.scrollHeight > el.clientHeight + 1) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [text, width, line, styles]);

  const content = onClick ? (
    <Button
      onClick={onClick}
      style={{
        padding: 0,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}>
      <Typography
        component="span"
        ref={textRef}
        style={{
          textAlign: 'left',
          width: width,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: line,
          overflow: 'hidden',
          ...styles
        }}
        color="text.primary">
        {text}
      </Typography>
    </Button>
  ) : (
    <Typography
      component="span"
      ref={textRef}
      style={{
        textAlign: 'left',
        width: width,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: line,
        overflow: 'hidden',
        ...styles
      }}
      color="text.primary">
      {text}
    </Typography>
  );

  return showTooltip ? (
    <Tooltip title={text}>
      <span>{content}</span>
    </Tooltip>
  ) : (
    content
  );
};
