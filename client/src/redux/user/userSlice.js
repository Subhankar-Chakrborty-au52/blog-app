import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null, // Current user data (null if no user is authenticated)
  error: null, // Error message (null if no error)
  loading: false, // Loading indicator (true when asynchronous actions are in progress)
};

// Create a Redux slice for managing user-related state
const userSlice = createSlice({
  name: "user", // Slice name
  initialState, // Initial state for the slice
  reducers: {
    // Reducer functions for handling various actions

    // Action to indicate that user sign-in process has started
    signInStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Clear any previous error
    },

    // Action to handle successful user sign-in
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Update currentUser with user data from action payload
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },

    // Action to handle failed user sign-in
    signInFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Update error with the error message from action payload
    },

    // Action to indicate that user update process has started
    updateStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Clear any previous error
    },

    // Action to handle successful user update
    updateSuccess: (state, action) => {
      state.currentUser = action.payload; // Update currentUser with user data from action payload
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },

    // Action to handle failed user update
    updateFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Update error with the error message from action payload
    },

    // Action to indicate that user deletion process has started
    deleteUserStart: (state) => {
      state.loading = true; // Set loading to true
      state.error = null; // Clear any previous error
    },

    // Action to handle successful user deletion
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear currentUser (no user is authenticated)
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },

    // Action to handle failed user deletion
    deleteUserFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Update error with the error message from action payload
    },
  },
});

// Export individual action creators and the reducer from the user slice
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} = userSlice.actions;
export default userSlice.reducer; // Export the user reducer
