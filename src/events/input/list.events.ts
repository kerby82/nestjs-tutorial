export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}

export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
  page: number = 1;
  offset: number = 0;
}
