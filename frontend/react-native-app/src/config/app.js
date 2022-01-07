const appConfig = {
  // todo add library to handle env variables
  // emailAuthAPIEndPoint: 'https://undercard-production.herokuapp.com',
  emailAuthAPIEndPoint: 'https://undercard-staging.herokuapp.com',
  defaultTimeout: 30000,
  pubPublishKey: 'pub-c-09038c51-029c-47a7-95f2-b6c7407afb12',
  pubSubscribeKey: 'sub-c-6b1bee04-ba9f-11e9-8753-ce76e7dc5905',
};

// const stripe = {
//   publicKey:
//     'pk_live_51Gx2uDFx3mptEQEdO94OdoSrcPCVxoZ62sGBXAVasCf7Mp9TAcGWl1Q9yaBDXS38eP41MgQqQIZBFLMDUEr1Gy1T000dkk5Wcz',
// };
const stripe = {
  publicKey:
    'pk_test_51Gx2uDFx3mptEQEdEDhSYIeBfFXqbwsdrhI1JhwEUrMeOPLF2MWnP3WX1h9iRuteRXWQRZrgYQyzH3x36QgBzy2e00SRhxAgEa',
};

const appInfo = {
  appName: 'Rec App',
};

const regx = {
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  month: /^(0?[1-9]|1[012])$/,
  year: /^[0-9]{2}$/,
  cvv: /^[0-9]{3,4}$/,
  cardNumber: /^[0-9]{13,16}$/,
};

export {appConfig, stripe, regx, appInfo};
