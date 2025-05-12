
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Calendar, 
  Phone 
} from 'lucide-react';

const mockLeads = [
  { 
    id: 1, 
    name: 'Emma Thompson', 
    email: 'emma@example.com', 
    phone: '(555) 123-4567',
    status: 'New Lead', 
    source: 'Website',
    lastActivity: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'michael@example.com',
    phone: '(555) 234-5678',
    status: 'Follow Up', 
    source: 'Referral',
    lastActivity: '1 day ago'
  },
  { 
    id: 3, 
    name: 'Sarah Johnson', 
    email: 'sarah@example.com',
    phone: '(555) 345-6789',
    status: 'Contacted', 
    source: 'Zillow',
    lastActivity: '3 days ago'
  },
  { 
    id: 4, 
    name: 'David Rodriguez', 
    email: 'david@example.com',
    phone: '(555) 456-7890',
    status: 'Qualified', 
    source: 'Open House',
    lastActivity: '1 week ago'
  },
  { 
    id: 5, 
    name: 'Jennifer Lee', 
    email: 'jennifer@example.com',
    phone: '(555) 567-8901',
    status: 'Negotiation', 
    source: 'Facebook Ad',
    lastActivity: '2 weeks ago'
  }
];

const statusColors = {
  'New Lead': 'bg-blue-100 text-blue-800',
  'Follow Up': 'bg-purple-100 text-purple-800',
  'Contacted': 'bg-yellow-100 text-yellow-800',
  'Qualified': 'bg-green-100 text-green-800',
  'Negotiation': 'bg-pink-100 text-pink-800'
};

export const Leads = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <Button>Add New Lead</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="w-full pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New Lead</SelectItem>
                <SelectItem value="followup">Follow Up</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="hidden md:table-cell">Last Activity</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{lead.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm">
                    <div>{lead.email}</div>
                    <div>{lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                    {lead.status}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{lead.source}</TableCell>
                <TableCell className="hidden md:table-cell">{lead.lastActivity}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Leads;
