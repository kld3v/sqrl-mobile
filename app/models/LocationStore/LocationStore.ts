import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { locationService } from "app/services/Location"

/**
 * Model description here for TypeScript hints.
 */
export const LocationStoreModel = types
  .model("LocationStore")
  .props({
    latitude: types.maybe(types.number),
    longitude: types.maybe(types.number),
    permission: types.maybe(types.boolean),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async getAndSetCurrentPosition() {
      // call locationService to get current location]
      const { coords } = await locationService.getCurrentPosition()
      self.setProp("latitude", coords.latitude)
      self.setProp("longitude", coords.longitude)
    },

    setPermission() {
      self.setProp("permission", locationService.permission.granted)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LocationStore extends Instance<typeof LocationStoreModel> {}
export interface LocationStoreSnapshotOut extends SnapshotOut<typeof LocationStoreModel> {}
export interface LocationStoreSnapshotIn extends SnapshotIn<typeof LocationStoreModel> {}
export const createLocationStoreDefaultModel = () => types.optional(LocationStoreModel, {})
