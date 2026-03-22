/**
 * @file store.js
 * @layer Data Layer (Redux)
 * @description
 * Root Redux store for the QueryMind frontend application.
 *
 * All feature slices are registered here. The store is the single place
 * where Redux state is configured — no other file should call configureStore.
 *
 * Consumed by:
 *  - main.jsx  →  wraps <App /> with <Provider store={store}>
 *  - Any hook that calls useSelector / useDispatch
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";

/**
 * The root Redux store.
 *
 * State shape:
 * {
 *   auth: AuthState   // see authSlice.js for the AuthState typedef
 * }
 */
const store = configureStore({
  reducer: {
    /**
     * auth — manages user session, tokens, loading, and error state.
     * Populated by loginThunk, registerThunk, and logoutThunk.
     */
    auth: authReducer,
  },

  // Redux DevTools is enabled automatically in development.
  // It is disabled in production by @reduxjs/toolkit when NODE_ENV === "production".
});

export default store;
