import {values} from 'lodash';

export const initialState = [];

export const Boxing = 'Boxing';
export const Yoga = 'Yoga';
export const HIIT = 'HIIT';
export const Meditation = 'Meditation';

export const BOXING = Boxing.toUpperCase();
export const YOGA = Yoga.toUpperCase();
export const MEDITATION = Meditation.toUpperCase();

export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';

export const geoFilters = [
  {
    displayName: '<0.5 mi',
    value: 0.5,
  },
  {
    displayName: '<1 mi',
    value: 1,
  },
  {
    displayName: '<1.5 mi',
    value: 1.5,
  },
  {
    displayName: '<2 mi',
    value: 2,
  },
];

export const HEADER_BUTTONS = ['Classes', 'Trainer'];
