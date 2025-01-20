import { Event } from './event.entity';

test('Event should be initialized trough constructor', () => {
  const event = new Event({
    name: 'Event Name',
    description: 'Event Description',
  });

  expect(event).toEqual({
    name: 'Event Name',
    description: 'Event Description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
  });
});
