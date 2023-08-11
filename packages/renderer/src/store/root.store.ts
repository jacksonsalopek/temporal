import { SSDStore, Store } from '@shared/ssd';
import { DashboardSlice } from './dashboard';
import { LayoutSlice } from './layout';
import { TransactionsSlice } from './transactions';

@Store({
  name: 'root',
  refs: [LayoutSlice, TransactionsSlice, DashboardSlice],
})
export class RootStore extends SSDStore {}
