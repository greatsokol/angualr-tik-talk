import {Profile} from "@tt/interfaces/profile";
import {createFeature, createReducer, on} from "@ngrx/store";
import {profileActions} from "./actions";

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  me: Profile | null,
  avatarUrl: string | null,
  page: number,
  size: number
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  avatarUrl: null,
  page: 1,
  size: 10
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,

    on(profileActions.filterEvent, (state, payload) => {
      return {
        ...state,
        profiles: [],
        page: initialState.page,
        profileFilters: payload.filters
      }
    }),

    on(profileActions.setPage, (state, payload) => {
      const page = payload.page ?? state.page + 1;
      return {
        ...state,
        page
      }
    }),

    on(profileActions.profilesLoadedEvent, (state, payload) => {
      return {
        ...state,
        profiles: state.profiles.concat(payload.profiles)
      }
    }),

    on(profileActions.meLoadedEvent, (state, payload) => {
      return {
        ...state,
        me: payload.me,
        avatarUrl: payload.me.avatarUrl
      }
    })
  )
})
