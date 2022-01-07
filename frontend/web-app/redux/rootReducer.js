import { combineReducers } from "redux";
import classReducer from "./details/reducer";
import trainerReducer from "./trainer/reducer";

export default combineReducers({
    classData: classReducer,
    trainer: trainerReducer,
});
