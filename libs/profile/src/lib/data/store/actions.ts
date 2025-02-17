import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Profile} from "@tt/interfaces/profile";

export const profileActions = createActionGroup({
    source: 'profile',
    events: {
      'filter event': props<{ filters: Record<string, any> }>(),
      'profiles loaded event': props<{ profiles: Profile[] }>(),
      'get me event': emptyProps(),
      'me loaded event': props<{ me: Profile }>()
    }
  }
)
