const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  termsScreen: {
    title: "Welcome Aboard!",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  historyScreen: {
    title: "History",
    subHeader: "View your QR scan history. Click to revisit that destination!",
  },
  leaderboardScreen: {
    title: "Top Scanners",
    subHeader: "West-Sydney League",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  SignUpScreen: {
    signIn: "Secure QR Scanning Awaits.",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToSignUp: "Tap to sign in!",
    hint: "Hint: you can use any email address and your favorite password :)",
    termsAndConditions_1: "By signing up, you agree to our ",
    termsAndConditions_2: "Terms ",
    termsAndConditions_3: "and ",
    privacyPolicy: "Privacy Policy.",
  },
  navigator: {
    scannerTab: "Scanner",
    mapTab: "Map",
    communityTab: "Community",
    debugTab: "Me",
    pushTab: "Push",
    marketPlaceTab: "Rewards",
  },
  communityScreen: {
    title: "JOIN OUR COMMUNITY",
    tagLine: "Coming Soon...",
    description:
      "Challenge your friends, family, and local community to ramp up your scan game and unlock even greater rewards.",
    thisIsRoger: "This is Roger.",
    hireUs: "He likes leaves.",
    interweb: "get sneak peaks on our page on the interweb-net",
  },
  marketPlaceScreen: {
    title: "Rewards",
    tagLine: "Coming Soon...",
    description:
      "Earn in-app tokens effortlessly as you scan, for exclusive perks from top brands in our marketplace.",
  },
  mapScreen: {
    title: "Maps",
    tagLine: "We found these humans to make our app. But they haven't made our map yet...",
    weLikeLeaves: "You'll get to see where the nearest and juiciest leaves are. Mmmmm.",

    headquarters: "Click to see our secret headquarters",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  scannerScreen: {
    proceedButton: "Proceed",
  },
}

export default en
export type Translations = typeof en
