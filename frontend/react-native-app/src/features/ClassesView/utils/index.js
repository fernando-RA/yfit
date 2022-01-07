import moment from 'moment';

export const calculateEstimatedProfit = (
  pricePerAttendee,
  attendeeLimit,
  promocodeDiscount,
  promocodeConfirmed,
) => {
  if (!pricePerAttendee) {
    pricePerAttendee = 0;
  }
  let fullEstimate = pricePerAttendee * attendeeLimit;
  let promoEstimate = 0;
  if (promocodeConfirmed) {
    promoEstimate =
      pricePerAttendee * attendeeLimit * (promocodeDiscount / 100);
  } else {
    promoEstimate = 0;
  }
  fullEstimate = fullEstimate - promoEstimate;
  return fullEstimate;
};

export const sortClasses = classes => {
  const upcomingClasses = [];
  const draftClasses = [];
  const pastClasses = [];

  classes.forEach(classData => {
    const startDate = new Date(classData.start_time);
    if (!classData.published_at || classData.canceled) {
      draftClasses.push(transformServerClassesData(classData));
      return;
    }
    if (moment(startDate).isBefore(new Date())) {
      pastClasses.push(transformServerClassesData(classData));
      return;
    }
    upcomingClasses.push(transformServerClassesData(classData));
  });

  return {
    upcomingClasses,
    draftClasses,
    pastClasses,
  };
};

export const transformServerClassesData = classData => {
  const {
    id,
    slug,
    hash,
    created_at,
    published_at,
    geotag,
    author,
    suggested_location,
    ...restClassData
  } = classData;
  return {
    id: classData.id,
    classData: {
      ...restClassData,
      link: {
        value: classData.link,
        error: '',
      },
      attend_limit_count: {
        value: String(classData.attend_limit_count),
        error: '',
      },
      price: {
        value: `$${parseInt(classData.price, 10)}`,
        error: '',
      },
      type: classData.type === 'in_person' ? 0 : 1,
    },
  };
};

export const endDateCalculate = (startDate, durationTime) => {
  return new Date(Number(new Date(startDate)) + durationTime * 60 * 1000);
};

export const createFormFromClassData = (classData, draft) => {
  const {class_link, ...restClassData} = classData;
  let featured_photo = null;
  if (
    typeof classData?.featured_photo === 'string' &&
    classData?.featured_photo
  ) {
    featured_photo = classData?.featured_photo;
  } else if (classData?.featured_photo?.data) {
    featured_photo = classData?.featured_photo?.data;
  }

  return {
    ...restClassData,
    link: classData.link.value,
    price: classData.price.value.replace(/\D/g, '') || 10,
    attend_limit_count: classData.attend_limit_count.value || 10,
    type: classData.type === 0 ? 'in_person' : 'virtual',
    featured_photo,
    end_repeat:
      classData.repeat !== 'never'
        ? classData.end_repeat
        : endDateCalculate(classData.start_time, classData.duration),
    published_at: !draft ? new Date() : null,
    // promo_code: classData.promo_code.filter(
    //   elem => elem.discount > 0 && elem.promo !== '',
    // ),
  };
};
