import * as constants from './constants';

export const setClassName = payload => ({
  type: constants.SET_NAME_OF_CLASS,
  payload,
});

export const setStartDate = payload => ({
  type: constants.SET_START_DATE,
  payload,
});

export const setDuration = payload => ({
  type: constants.SET_DURATION,
  payload,
});

export const setRepeat = payload => ({
  type: constants.SET_REPEAT,
  payload,
});

export const setEndOfRepeat = payload => ({
  type: constants.SET_END_OF_REPEAT,
  payload,
});

export const addTag = payload => ({
  type: constants.ADD_TAG,
  payload,
});

export const removeTag = payload => ({
  type: constants.REMOVE_TAG,
  payload,
});

export const changePhoto = payload => ({
  type: constants.CHANGE_PHOTO,
  payload,
});

export const deletePhoto = () => ({
  type: constants.DELETE_PHOTO,
});

export const setDetails = payload => ({
  type: constants.SET_DETAILS_OF_CLASS,
  payload,
});

export const setEquipments = payload => ({
  type: constants.SET_EQUIPMENTS_OF_CLASS,
  payload,
});

export const setLocationAction = payload => ({
  type: constants.SET_LOCATION,
  payload,
});

export const setLocationNotesAction = payload => ({
  type: constants.SET_LOCATION_NOTES,
  payload,
});

export const setSafeProcotol = payload => ({
  type: constants.SET_SAFE_PROTOCOL,
  payload,
});

export const setTypeOfClasses = payload => ({
  type: constants.SET_TYPE_OF_CLASSES,
  payload,
});

export const setVirtualLink = (value, error) => ({
  type: constants.SET_VIRTUAL_LINK,
  payload: {
    value,
    error,
  },
});

export const setVirtualPassword = payload => ({
  type: constants.SET_VIRTUAL_PASSWORD,
  payload,
});

export const setAttendeePrice = (value, error) => ({
  type: constants.SET_ATTENDEE_PRICE,
  payload: {
    value,
    error,
  },
});

export const setAttendeeLimit = (value, error) => ({
  type: constants.SET_ATTENDEE_LIMIT,
  payload: {
    value,
    error,
  },
});

export const setAttendeeUnlimited = payload => ({
  type: constants.SET_ATTENDEE_UNLIMITED,
  payload,
});

export const setClassFree = payload => ({
  type: constants.SET_CLASS_FREE,
  payload,
});

export const setPromoValue = payload => ({
  type: constants.SET_PROMO_VALUE,
  payload,
});

export const setPromoConfirm = payload => ({
  type: constants.SET_PROMO_CONFIRM,
  payload,
});

export const setPolicy = payload => ({
  type: constants.SET_POLICY,
  payload,
});

export const clearCurrentClass = () => ({
  type: constants.CLEAR_CURRENT_CLASS,
});

export const setClassInDraft = payload => ({
  type: constants.SET_CLASS_IN_DRAFT,
  payload,
});

export const setInDrafts = payload => ({
  type: constants.SET_IN_DRAFTS,
  payload,
});

export const setClassForPreview = payload => ({
  type: constants.SET_CLASS_FOR_PREVIEW,
  payload,
});

export const setDraftForEdit = payload => ({
  type: constants.SET_DRAFT_FOR_EDIT,
  payload,
});

export const saveExistingClass = payload => ({
  type: constants.SAVE_EXISTING_CLASS_SUCCESS,
  payload,
});

export const setClassForDuplicate = payload => ({
  type: constants.SET_CLASS_FOR_DUPLICATE,
  payload,
});

export const saveExistingDraft = payload => ({
  type: constants.SAVE_EXISTING_DRAFT,
  payload,
});

export const saveExistingDraftRequest = payload => ({
  type: constants.SAVE_EXISTING_DRAFT_REQUEST,
  data: payload,
});

export const classFetching = payload => ({
  type: constants.CLASS_FETCHING,
  payload,
});

export const getTrainerClassSuccess = payload => ({
  type: constants.GET_TRAINER_CLASS_SUCCESS,
  payload,
});

export const getTrainerClassFailed = () => ({
  type: constants.GET_TRAINER_CLASS_ERROR,
});

export const getClasses = () => ({
  type: constants.GET_TRAINER_CLASSES_REQUEST,
});

export const publishNewClassSuccess = payload => ({
  type: constants.PUBLISH_NEW_CLASS_SUCCESS,
  payload,
});

export const getTrainerClassesFetching = () => ({
  type: constants.GET_TRAINER_CLASSES_FETCHING,
});

export const successPublishing = payload => ({
  type: constants.FINISH_PUBLISHING,
  payload,
});

export const publishClassRequest = payload => ({
  type: constants.PUBLISH_NEW_CLASS_REQUEST,
  data: payload,
});

export const editExistingClassRequest = payload => ({
  type: constants.EDIT_TRAINER_CLASSES_REQUEST,
  data: payload,
});

export const editClassSuccess = payload => ({
  type: constants.EDIT_TRAINER_CLASS_SUCCESS,
});

export const saveDraftRequest = payload => ({
  type: constants.SAVE_DRAFT_REQUEST,
  data: payload,
});

export const setPastClassForPreview = payload => ({
  type: constants.SET_PAST_CLASS_FOR_PREVIEW,
  payload,
});

export const setImageForClassesRequest = payload => ({
  type: constants.SET_IMAGE_FOR_CLASS,
  data: payload,
});

export const signUpClientsRequest = payload => ({
  type: constants.GET_SIGNUP_CLIENTS,
  data: payload,
});

export const getSignUpClientsSuccess = payload => ({
  type: constants.GET_SIGNUP_CLIENTS_SUCCESS,
  payload,
});

export const clearClientsSignUp = () => ({
  type: constants.CLIENTS_SIGNUP_CLEAR,
});

export const cancelClass = payload => ({
  type: constants.CANCEL_CLASS_REQUEST,
  payload,
});
export const cancelClassLoading = payload => ({
  type: constants.CANCEL_CLASS_REQUEST_LOADING,
  payload,
});
