import {Profile} from "@tt/interfaces/profile";
import {createFeature, createReducer, on} from "@ngrx/store";
import {profileActions} from "./actions";

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  me: Profile | null,
  avatarUrl: string | null
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  avatarUrl: null
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      }
    }),

    on(profileActions.meLoaded, (state, payload) => {
      return {
        ...state,
        me: payload.me,
        avatarUrl: payload.me.avatarUrl
      }
    })
  )
})
