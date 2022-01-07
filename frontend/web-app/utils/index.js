export const getEndOfClass = (startTime, duration) => {
    return new Date(Number(new Date(startTime)) + duration * 60 * 1000);
};

export const filterAllClassesByTrainerId = (classes, id) => {
    return classes.filter((classData) => classData.author === id);
};
