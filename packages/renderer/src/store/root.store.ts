import { SSDStore, Store } from '@shared/ssd';
import { LayoutSlice } from './layout';

@Store({
  name: 'root',
  refs: [LayoutSlice],
})
export class RootStore extends SSDStore {}
