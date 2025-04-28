import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unread: 0,
  items: []
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unread = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unread += 1;
    },
    markAsRead: (state) => {
      state.unread = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unread = 0;
    }
  }
});

export const { setUnreadCount, addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer; 