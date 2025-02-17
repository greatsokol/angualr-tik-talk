import {Profile} from "@tt/interfaces/profile";
import {createFeature, createReducer, on} from "@ngrx/store";
import {profileActions} from "./actions";

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  me: Profile | null,
  avatarUrl: string | null,
  searchFilter: {
    firstName: string,
    lastName: string,
    stack: string
  }
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  avatarUrl: null,
  searchFilter: {
    firstName: '',
    lastName: '',
    stack: ''
  }
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,

    on(profileActions.filterEvent, (state, payload) => {
      return {
        ...state,
        searchFilter: {
          firstName: payload.filters["firstName"],
          lastName: payload.filters["lastName"],
          stack: payload.filters["stack"]
        }
      }
    }),

    on(profileActions.profilesLoadedEvent, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
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
