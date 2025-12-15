import type { store } from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export interface AppControl {
  dispatch: AppDispatch;
}
