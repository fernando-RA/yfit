export const filterByWorkoutType = (filters, classes) => {
  const filteredClasses = classes.filter(classData => {
    let countMatches = 0;
    filters.forEach(filter =>
      classData.tags.includes(filter.workout_type) ? countMatches++ : null,
    );
    return countMatches === filters.length;
  });
  return filteredClasses;
};
