import * as constants from './constants';

const PROTOCOLS_PRETEXT =
  'Masks are required for all attendees. All equipment is sanitized before class.';

const initialState = {
  init: {
    init: false,
    error: false,
    isFetching: false,
  },
  success: false,
  isFetching: false,
  promoCodeConfirmed: false,
  classData: {
    class_link: '',
    name: '',
    start_time: '',
    duration: 30,
    repeat: 'never',
    end_repeat: null,
    featured_photo: '',
    location: '',
    details: '',
    equipment: '',
    type: 0,
    location_notes: '',
    safety_protocol: PROTOCOLS_PRETEXT,
    link: {
      error: '',
      value: '',
    },
    password: '',
    price: {
      error: '',
      value: '',
    },
    is_attendee_limit: true,
    free: false,
    attend_limit_count: {
      error: '',
      value: '',
    },
    promo_code: [],

    cancellation_policy: 'flexible',
    tags: [],
  },
  tags: [
    'Boxing',
    'Yoga',
    'HIIT',
    'Sculpt',
    'Martial arts',
    'Cardio',
    'Meditation',
    'Beginner',
    'Intermediate',
    'Advanced',
    'Good for all levels',
  ].map((n, i) => ({name: n, id: i})),
  draftClasses: [],
  upcomingClasses: [],
  pastClasses: [],
  signUpClients: [],
  cancelClassLoading: false,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case constants.SET_NAME_OF_CLASS:
      return {...state, classData: {...state.classData, name: payload}};
    case constants.SET_START_DATE:
      return {...state, classData: {...state.classData, start_time: payload}};
    case constants.SET_END_OF_REPEAT:
      return {...state, classData: {...state.classData, end_repeat: payload}};
    case constants.SET_DURATION:
      return {...state, classData: {...state.classData, duration: payload}};
    case constants.SET_REPEAT:
      return {...state, classData: {...state.classData, repeat: payload}};
    case constants.ADD_TAG:
      return {
        ...state,
        classData: {
          ...state.classData,
          tags: [...state.classData.tags, payload],
        },
      };
    case constants.REMOVE_TAG:
      return {
        ...state,
        classData: {
          ...state.classData,
          tags: [...state.classData.tags].filter(
            elem => elem.name !== payload.name,
          ),
        },
      };
    case constants.CHANGE_PHOTO:
      return {
        ...state,
        classData: {...state.classData, featured_photo: payload},
      };
    case constants.DELETE_PHOTO:
      return {...state, classData: {...state.classData, featured_photo: ''}};
    case constants.SET_DETAILS_OF_CLASS:
      return {...state, classData: {...state.classData, details: payload}};
    case constants.SET_EQUIPMENTS_OF_CLASS:
      return {...state, classData: {...state.classData, equipment: payload}};
    case constants.SET_LOCATION:
      return {...state, classData: {...state.classData, location: payload}};
    case constants.SET_LOCATION_NOTES:
      return {
        ...state,
        classData: {...state.classData, location_notes: payload},
      };
    case constants.SET_SAFE_PROTOCOL:
      return {
        ...state,
        classData: {...state.classData, safety_protocol: payload},
      };
    case constants.SET_VIRTUAL_LINK:
      return {
        ...state,
        classData: {
          ...state.classData,
          link: {
            value: payload.value,
            error: payload.error ? payload.error : '',
          },
        },
      };
    case constants.SET_TYPE_OF_CLASSES: {
      return {...state, classData: {...state.classData, type: payload}};
    }
    case constants.SET_VIRTUAL_PASSWORD: {
      return {...state, classData: {...state.classData, password: payload}};
    }
    case constants.SET_ATTENDEE_PRICE:
      return {
        ...state,
        classData: {
          ...state.classData,
          price: {
            value: payload.value,
            error: payload.error ? payload.error : '',
          },
        },
      };
    case constants.SET_ATTENDEE_LIMIT:
      return {
        ...state,
        classData: {
          ...state.classData,
          attend_limit_count: {
            value: payload.value,
            error: payload.error ? payload.error : '',
          },
        },
      };
    case constants.SET_ATTENDEE_UNLIMITED:
      return {
        ...state,
        classData: {...state.classData, is_attendee_limit: payload},
      };
    case constants.SET_CLASS_FREE:
      return {
        ...state,
        classData: {...state.classData, free: payload},
      };
    case constants.SET_PROMO_VALUE:
      return {
        ...state,
        classData: {
          ...state.classData,
          promo_code: payload,
        },
      };

    case constants.SET_PROMO_CONFIRM:
      return {
        ...state,
        promoCodeConfirmed: payload,
      };
    case constants.SET_POLICY:
      return {
        ...state,
        classData: {...state.classData, cancellation_policy: payload},
      };
    case constants.CLEAR_CURRENT_CLASS:
      return {
        ...state,
        classData: {...initialState.classData},
      };
    case constants.SET_IN_DRAFTS:
      return {
        ...state,
        draftClasses: [
          ...state.draftClasses,
          {
            id: payload.id,
            classData: {...state.classData, class_link: payload.class_link},
          },
        ],
      };
    case constants.SET_CLASS_FOR_PREVIEW: {
      const classForPreview = state.upcomingClasses.find(
        upcomingClass => upcomingClass.id === payload,
      );
      return {
        ...state,
        classData: {
          ...initialState.classData,
          ...classForPreview.classData,
        },
      };
    }
    case constants.SET_DRAFT_FOR_EDIT: {
      const classForEdit = state.draftClasses.find(
        draftClass => draftClass.id === payload,
      );
      return {
        ...state,
        classData: {
          ...initialState.classData,
          ...classForEdit.classData,
        },
      };
    }
    case constants.SAVE_EXISTING_CLASS_SUCCESS: {
      const editedClasses = state.upcomingClasses.map(upcomingClass => {
        if (upcomingClass.id === payload.id) {
          return {
            id: payload.id,
            classData: {...state.classData, class_link: payload.class_link},
          };
        }
        return upcomingClass;
      });
      return {
        ...state,
        upcomingClasses: editedClasses,
        success: false,
      };
    }
    case constants.SET_CLASS_FOR_DUPLICATE: {
      const classForDuplicate = state.upcomingClasses.find(
        upcomingClass => upcomingClass.id === payload,
      );
      return {
        ...state,
        classData: {...classForDuplicate.classData},
      };
    }
    case constants.SAVE_EXISTING_DRAFT: {
      const editedDraft = state.draftClasses.map(draftClass => {
        if (draftClass.id === payload.id) {
          return {
            id: payload.id,
            classData: {...state.classData, class_link: payload.class_link},
          };
        }
        return draftClass;
      });
      return {
        ...state,
        draftClasses: editedDraft,
      };
    }
    case constants.GET_TRAINER_CLASSES_SUCCESS:
      return {
        ...state,
        upcomingClasses: payload.upcomingClasses,
        draftClasses: payload.draftClasses,
        pastClasses: payload.pastClasses,
      };
    case constants.GET_TRAINER_CLASS_ERROR:
      return {
        ...state,
        init: {
          error: true,
          init: false,
        },
      };
    case constants.CLASS_FETCHING:
      return {...state, isFetching: payload};
    case constants.PUBLISH_NEW_CLASS_SUCCESS: {
      return {
        ...state,
        upcomingClasses: [
          ...state.upcomingClasses,
          {
            id: payload.id,
            classData: {
              ...payload.classData,
            },
          },
        ],
        classData: {
          ...state.classData,
          class_link: payload.classData.class_link,
        },
        success: false,
      };
    }
    case constants.GET_TRAINER_CLASS_SUCCESS:
      return {
        ...state,
        init: {init: true, error: false, isFetching: false},
        upcomingClasses: payload.upcomingClasses,
        draftClasses: payload.draftClasses,
        pastClasses: payload.pastClasses,
      };
    case constants.FINISH_PUBLISHING:
      return {...state, success: payload};
    case constants.GET_TRAINER_CLASSES_FETCHING:
      return {
        ...state,
        init: {init: false, error: true, isFetching: true},
      };
    case constants.GET_TRAINER_CLASS_ERROR:
      return {...state, init: {init: true, error: true, isFetching: false}};
    case constants.SET_UPCOMING_CLASSES:
      return {...state, upcomingClasses: payload};
    case constants.SET_PAST_CLASS_FOR_PREVIEW:
      const pastClassForPreview = state.pastClasses.find(
        pastClass => pastClass.id === payload,
      );
      return {
        ...state,
        classData: {
          ...pastClassForPreview.classData,
        },
      };
    case constants.CLIENTS_SIGNUP_CLEAR:
      return {
        ...state,
        signUpClients: [],
      };
    case constants.GET_SIGNUP_CLIENTS_SUCCESS:
      return {
        ...state,
        signUpClients: payload,
      };
    case constants.CANCEL_CLASS_REQUEST_LOADING:
      return {
        ...state,
        cancelClassLoading: payload,
      };
    default:
      return state;
  }
};
