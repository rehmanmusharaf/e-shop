// import { createReducer } from "@reduxjs/toolkit";
// // import { createSlice, nanoid } from "@reduxjs/toolkit";
// const initialState = {
//   isAuthenticated: false,
// };

// export const userReducer = createReducer(initialState, {
//   LoadUserrequest: (state) => {
//     state.loading = true;
//   },
//   LoadUserSuccess: (state, action) => {
//     state.isAuthenticated = true;
//     state.loading = false;
//     state.user = action.payload;
//   },
//   LoaduserFail: (state, action) => {
//     state.loading = false;
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
  loading: false,
  user: null,
  error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LOAD_USER_REQUEST", (state) => {
      state.loading = true;
    })
    .addCase("LOAD_USER_SUCCESS", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload || null;
      state.error = null;
    })
    .addCase("LOAD_USER_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase("CLEAR_ERRORS", (state) => {
      state.error = null;
    });
});
