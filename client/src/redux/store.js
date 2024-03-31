import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "./theme/themeSlice";

// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer, // User-related reducer
  theme: themeReducer, // Theme-related reducer
});

// Configuration object for redux-persist
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Storage engine to use for persistence (localStorage by default)
  version: 1, // Version of the persisted state
};

// Create a persisted reducer by wrapping the root reducer with redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer as the root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Disable serializable check to allow non-serializable values in state
});

// Create a Redux persistor to persist the Redux store state
export const persistor = persistStore(store);
