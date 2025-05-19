
export interface Event {
  id: number;
  title: string;
  client: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'showing' | 'meeting' | 'open-house' | 'call';
}

export const eventTypeColors = {
  showing: 'bg-blue-100 border-blue-300 text-blue-800',
  meeting: 'bg-purple-100 border-purple-300 text-purple-800',
  'open-house': 'bg-green-100 border-green-300 text-green-800',
  call: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};
