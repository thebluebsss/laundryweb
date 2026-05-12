import { useCallback, ReactElement, useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useFlash } from 'contexts/flash';
/**
 * @returns Component Flash Element
 */
export const Flash = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const { flash, setFlash } = useFlash();

  useEffect(() => {
    if (flash?.message) {
      setOpen(true);
    }
  }, [flash?.message]);

  const handleClose = useCallback((): void => {
    setOpen(false);
    setFlash(null);
  }, [setFlash]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      open={open}
      onClose={handleClose}>
      <div>
        {flash && (
          <MuiAlert severity={flash.type} onClose={handleClose}>
            {flash.message}
          </MuiAlert>
        )}
      </div>
    </Snackbar>
  );
};
