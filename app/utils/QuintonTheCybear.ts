import * as Device from "expo-device"

export class QuintonTheCybear {
  brand: string | null

  constructor() {
    this.brand = Device.brand
  }

  log = (message: string, someValue?: any) => {
    __DEV__ &&
      console.log(
        `\n 🐨: ${message}\n >>> ${someValue}\n 🍃'n around in ${
          Device.brand === "Apple" ? "an" : "a"
        } ${Device.brand} device.\n\n`,
      )
  }
}

export const quintonTheCybear = new QuintonTheCybear()
