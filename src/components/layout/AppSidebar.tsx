
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Inbox, MessageSquare, User, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const mainMenuItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: Users,
  },
  {
    title: 'Leads',
    path: '/leads',
    icon: User,
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Inbox',
    path: '/inbox',
    icon: Inbox,
  },
  {
    title: 'AI Assistant',
    path: '/ai-assistant',
    icon: MessageSquare,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded">
            <div className="h-6 w-6 text-primary-foreground flex items-center justify-center font-bold">
              RE
            </div>
          </div>
          <span className="font-bold text-lg">RealEstate CRM</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    active={
                      item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path)
                    }
                  >
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
