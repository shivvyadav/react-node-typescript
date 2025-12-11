// later put redux-store name as app or something more specific
import {configureStore} from "@reduxjs/toolkit";
import sampleReducer from "./features/sample/sample";

const store = configureStore({
  reducer: {
    sample: sampleReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// usages
// import {useAppDispatch, useAppSelector} from "./redux-store/hooks";

// const dispatch = useAppDispatch();
// const sampleState = useAppSelector((state: RootState) => state.sample);
