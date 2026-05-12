import {
  Stack,
  styled,
  Typography,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { InputText } from "../elements/InputText";
import { useAuth } from "contexts/auth";
import { useAdminListSearch } from "contexts/adminListSearch";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { ChangeEvent } from "react";

/** List screens where header search drives API filtering */
const LIST_SEARCH_PATH_RE = /^\/admin\/(users|clients|products|procedures)$/;

export const HeaderAdmin = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const { searchInput, setSearchInput, clearSearch } = useAdminListSearch();

  const showListSearch = useMemo(
    () => LIST_SEARCH_PATH_RE.test(location.pathname),
    [location.pathname],
  );

  /** Clear header search on any route change (including between list pages). */
  useEffect(() => {
    clearSearch();
  }, [location.pathname, clearSearch]);

  return (
    <WrapperHeader>
      {showListSearch ? (
        <Stack flex={1} maxWidth={560} minWidth={200}>
          <InputText
            inputProps={{
              value: searchInput,
              onChange: (
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => setSearchInput(e.target.value),
              sx: {
                backgroundColor: "#EEE",
                borderRadius: "27px",
                "& .MuiInputBase-input": {
                  background: "#EEE",
                  borderRadius: "27px",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderRadius: "27px",
                },
              },
            }}
            placeholder={"Search"}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.disabled" }} />
              </InputAdornment>
            }
          />
        </Stack>
      ) : (
        <Stack flex={1} minWidth={0} />
      )}
      <Stack
        direction="row"
        alignItems="center"
        gap={2.5}
        width={"fit-content"}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1.25}
          sx={{ cursor: "pointer" }}
        >
          <Avatar
            sx={{ width: 44, height: 44, backgroundColor: "#7B96AD" }}
            src="/images/avatar_placeholder.png"
            alt={auth?.firstName}
          />
          <Typography
            whiteSpace={"nowrap"}
            maxWidth={"100px"}
            color={"#161616"}
            fontWeight={700}
          >
            {auth?.firstName} {auth?.lastName}
          </Typography>
        </Stack>
        {/*<Menu*/}
        {/*  anchorEl={anchorEl}*/}
        {/*  open={open}*/}
        {/*  onClose={handleClose}*/}
        {/*  transformOrigin={{ horizontal: 'right', vertical: 'top' }}*/}
        {/*  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>*/}
        {/*  <MenuItem onClick={handleClose}>View Profile</MenuItem>*/}
        {/*  <MenuItem onClick={handleClose}>Edit Profile</MenuItem>*/}
        {/*</Menu>*/}
      </Stack>
    </WrapperHeader>
  );
};

const WrapperHeader = styled(Stack)(({ theme }) => ({
  gap: 88,
  width: "100%",
  backgroundColor: theme.palette.common.white,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingRight: "20px",
  paddingTop: "30px",
}));
