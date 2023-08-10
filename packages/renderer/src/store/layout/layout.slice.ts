import { SSDSlice, Slice, Reducer, Selector } from '@shared/ssd';

export enum LayoutActions {
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
}

export enum LayoutSelectors {
  IS_SIDEBAR_VISIBLE = 'IS_SIDEBAR_VISIBLE',
}

export type LayoutState = {
  isSidebarVisible: boolean;
};

@Slice({
  name: 'layout',
  actions: LayoutActions,
  selectors: LayoutSelectors,
})
export class LayoutSlice extends SSDSlice<LayoutState> {
  public static initialState: LayoutState = {
    isSidebarVisible: false,
  };

  constructor() {
    super(LayoutSlice.initialState);
  }

  @Selector({
    selector: LayoutSelectors.IS_SIDEBAR_VISIBLE,
    description: 'Gets sidebar visibility',
  })
  isSidebarVisible() {
    return this.get('isSidebarVisible');
  }

  @Reducer({
    action: LayoutActions.TOGGLE_SIDEBAR,
    description: 'Toggle sidebar visibility',
  })
  toggleSidebar() {
    this.set('isSidebarVisible', !this.isSidebarVisible());
  }
}
