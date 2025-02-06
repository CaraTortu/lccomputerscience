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
} from "~/app/_components/ui/sidebar"
import { adminLinks } from "~/constants"

export default function AdminNavbar() {
    return (
        <Sidebar className="pt-16">
            <SidebarContent>
                <SidebarHeader className="flex text-center pt-4 -ml-3">👋 Welcome Admin!</SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin site</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminLinks.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="font-medium flex gap-2">
                                            <item.icon />
                                            {item.name}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
