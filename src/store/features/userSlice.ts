import { createSlice } from "@reduxjs/toolkit";
import { userProps } from "../../types";

type initialStateProps = {
  userData?: userProps;
  session: {
    expiresAt: any;
  };
};

const initialState: initialStateProps = {
  userData: undefined,
  session: {
    expiresAt: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSessionExpiry: (state, action) => {
      state.session.expiresAt = action.payload;
    },
  },
});

export const { addUserData, setSessionExpiry } = userSlice.actions;

export const getUserData = (state: {
  persistedReducers: { user: { userData: initialStateProps["userData"] } };
}) => state.persistedReducers.user.userData;

export const getSessionExpiry = (state: {
  persistedReducers: { user: { session: { expiresAt: any } } };
}) => state.persistedReducers.user.session.expiresAt;

export default userSlice.reducer;
