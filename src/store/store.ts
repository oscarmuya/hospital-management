import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import localStorage from "redux-persist/es/storage";
import userSlice from "./features/userSlice";

const persistConfigUser = {
  key: "user",
  storage: localStorage,
};

const persistedReducers = combineReducers({
  user: persistReducer(persistConfigUser, userSlice),
});

const store = configureStore({
  reducer: {
    persistedReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, REHYDRATE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
