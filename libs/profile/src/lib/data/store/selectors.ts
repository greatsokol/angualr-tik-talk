import {createSelector} from "@ngrx/store";
import {profileFeature} from "./reducer";

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)

export const selectMe = createSelector(
  profileFeature.selectMe,
  (me) => me
)

export const selectSearchFilter = createSelector(
  profileFeature.selectSearchFilter,
  (searcFilter) => {
    return {
      firstName: searcFilter["firstName"],
      lastName: searcFilter["lastName"],
      stack: searcFilter["stack"]
    }
  }
)
