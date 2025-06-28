import React from 'react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { 
    name: 'Smartphones', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" opacity="0.3" d="M17 4v16H7V4h10m0-2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        <path fill="currentColor" d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm6-4H6V4h12v12z"/>
      </svg>
    )
  },
  { 
    name: 'Accessories', 
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" opacity="0.3" d="M12 3v2.55c-2.43.52-4.33 2.42-4.85 4.85H4v4h3.15c.52 2.43 2.42 4.33 4.85 4.85V21h4v-2.55c2.43-.52 4.33-2.42 4.85-4.85H20v-4h-3.15c-.52-2.43-2.42-4.33-4.85-4.85V3h-4zm2 10c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"/>
          <path fill="currentColor" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm0-11v2.55c2.43.52 4.33 2.42 4.85 4.85H20v4h-3.15c-.52 2.43-2.42 4.33-4.85 4.85V21h-4v-2.55c-2.43-.52-4.33-2.42-4.85-4.85H4v-4h3.15c.52-2.43 2.42-4.33 4.85-4.85V3h4zm-2 2H8.34C6.18 6.55 5 8.61 5 11v2c0 2.39 1.18 4.45 3.34 5.76V21h7.31v-2.24C17.82 17.45 19 15.39 19 13v-2c0-2.39-1.18-4.45-3.34-5.76V5h-3.66z"/>
       </svg>
    )
  },
  { 
    name: 'Wearables', 
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="currentColor" opacity="0.3" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm6 10.5c0 .28-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5v-7c0-.28.22-.5.5-.5s.5.22.5.5V12h4.5c.28 0 .5.22.5.5v.5z"/>
          <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm.5-13H12v6l5.25 3.15l.75-1.23l-4.5-2.67V7h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5zm-1 0c-.28 0-.5.22-.5.5v7c0 .28.22.5.5.5h5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H12V7.5c0-.28-.22-.5-.5-.5z"/>
       </svg>
    )
  },
  { 
    name: 'Tablets', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" opacity="0.3" d="M19 4v16H5V4h14m1-2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        <path fill="currentColor" d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm15 18V4H5v16h14z"/>
      </svg>
    )
  },
];
