/**
 * Purpose of this file to seperate the menu of each module. 
 * 
 */
import { WorkspaceService } from './services/workspace.service';

export let menuArr =
    {
        module: 'Workspace',
        description: 'Workspace Module',
        sub_module: '',
        all_applets: [
            { title: 'Lists', route: '/workspace/:id/lists', icon: 'lists',  applet: "Lists" },
            { title: 'Tasks', route: '/workspace/:id/tasks', icon: 'event_note',  applet: "Tasks" },
            { title: 'EOD Reports', route: '/workspace/:id/eodReports', icon: 'description',  applet: "EOD Reports" },
            { title: 'Approvals', route: '/workspace/:id/approvals', icon: 'fingerprint', applet: "Approvals" },

        ],
        applet_links: [


        ],
        links: [
            { title: 'Dashboard', route: '/workspace/:id', icon: 'dashboard', isDialouge: false },
        ],
        settings_links: [

            { title: 'Applets', route: '#', icon: 'view_module', isDialouge: true },
            { title: 'Group Settings', route: '/workspace/:id/settings', icon: 'settings', isDialouge: false }

        ]
    }

