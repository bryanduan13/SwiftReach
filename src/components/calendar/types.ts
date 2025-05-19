
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
  showing: 'bg-[#FAF3E0]/70 border-[#F57C00] text-[#3E2723]',
  meeting: 'bg-[#D7CCC8]/70 border-[#F57C00] text-[#3E2723]',
  'open-house': 'bg-[#F57C00]/20 border-[#F57C00] text-[#3E2723]',
  call: 'bg-[#BF360C]/10 border-[#F57C00] text-[#3E2723]',
};
