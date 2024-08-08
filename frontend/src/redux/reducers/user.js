// import { createReducer } from "@reduxjs/toolkit";
// // import { createSlice, nanoid } from "@reduxjs/toolkit";
// const initialState = {
//   isAuthenticated: false,
// };

// export const userReducer = createReducer(initialState, {
//   LoadUserrequest: (state) => {
//     state.isLoading = true;
//   },
//   LoadUserSuccess: (state, action) => {
//     state.isAuthenticated = true;
//     state.isLoading = false;
//     state.user = action.payload;
//   },
//   LoaduserFail: (state, action) => {
//     state.isLoading = false;
//     state.error = action.payload;
//     state.isAuthenticated = false;
//   },
//   clearErrors: (state) => {
//     state.error = null;
//   },
// });

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: null,
  user: null,
  users: null,
  error: null,
  usersLoading: false,
  successMessage: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LOAD_USER_REQUEST", (state) => {
      state.isLoading = true;
    })
    .addCase("LOAD_USER_SUCCESS", (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload || null;
      state.error = null;
    })
    .addCase("LOAD_USER_FAIL", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase("updateUserInfoRequest", (state, action) => {
      state.isLoading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.successMessage = action.payload.message;
    })
    .addCase("updateUserInfoFailed", (state, action) => {
      state.isLoading = false;
      state.successMessage = null;
      state.error = action.payload;
    })
    .addCase("clearMessages", (state, action) => {
      state.successMessage = null;
    })
    .addCase("updateUserAddressRequest", (state, action) => {
      state.isLoading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    })
    .addCase("updateUserAddressFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("deleteUserAddressRequest", (state, action) => {
      state.isLoading = true;
    })
    .addCase("deleteUserAddressSuccess", (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    })
    .addCase("deleteUserAddressFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("getAllUsersRequest", (state) => {
      state.usersLoading = true;
    })
    .addCase("getAllUsersSuccess", (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
    })
    .addCase("getAllUsersFailed", (state, action) => {
      state.usersLoading = false;
      state.error = action.payload;
    })
    .addCase("CLEAR_ERRORS", (state) => {
      state.error = null;
    });
});
