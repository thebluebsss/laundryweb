import { Stack, styled } from '@mui/material';
import { FC, useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';

type OtpInputProps = {
  length?: number;
  onChange: (otp: string) => void;
};

export const OtpInput: FC<OtpInputProps> = ({ length = 5, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      newOtp[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
      }
    });
    setOtp(newOtp);
    onChange(newOtp.join(''));
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <Stack direction="row" gap={length === 4 ? '26px' : 2} justifyContent="center">
      {otp.map((data, index) => (
        <StyledInput
          key={index}
          type="text"
          maxLength={1}
          value={data}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </Stack>
  );
};

const StyledInput = styled('input')(() => ({
  width: 44,
  height: 44,
  fontSize: 24,
  fontWeight: 500,
  textAlign: 'center',
  borderRadius: 10,
  border: `1px solid #979797`,
  outline: 'none',
  transition: 'border-color 0.2s',
  '&:focus': {
    backgroundColor: '#F8F8F8',
    borderWidth: 1.5
  },
  '@media (min-width: 600px)': {
    width: 44,
    height: 44
  }
}));
