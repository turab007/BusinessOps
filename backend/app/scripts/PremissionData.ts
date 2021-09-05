export =[
    {
        name: 'WorkSpaces',
        description: 'WorkSpaces management',
        status: true,
        weight: 0,
        modulePermissions: [

            { // WorkSpace Management
                permissionItems: [
                    { title: 'WorkSpace', controller: "workSpaces", action: "*", weight: 1, description: "Create Read Update and delete work space." },
                    { title: 'Create', controller: "workSpaces", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "workSpaces", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "workSpaces", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "workSpaces", action: "index", weight: 5, description: "" },
                    { title: 'Not personal workspaces', controller: "workSpaces", action: "getNotPersonal", weight: 6, description: "Get Those workspaces their type is not personal" },
                    { title: 'Add Work Space or assignment with user', controller: "workSpaces", action: "addWorkSpace", weight: 7, description: "Add Work Space or assignment with user" },
                    { title: 'Add Applet', controller: "workSpaces", action: "addApplet", weight: 8, description: "Add Applet to workspace" },
                    { title: 'Remove Applet', controller: "workSpaces", action: "removeApplet", weight: 9, description: "Remove applet to workspace" },
                    { title: 'Details', controller: "workSpaces", action: "view", weight: 10, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'workSpaces.*', 'child': 'workSpaces.index' },
                    { 'parent': 'workSpaces.*', 'child': 'workSpaces.update' },
                    { 'parent': 'workSpaces.*', 'child': 'workSpaces.create' },
                    { 'parent': 'workSpaces.*', 'child': 'workSpaces.delete' },
                    { 'parent': 'workSpaces.create', 'child': 'workSpaces.addWorkSpace' },
                    { 'parent': 'workSpaces.update', 'child': 'workSpaces.addWorkSpace' },
                    { 'parent': 'workSpaces.create', 'child': 'workSpaces.addApplet' },
                    { 'parent': 'workSpaces.update', 'child': 'workSpaces.addApplet' },
                    { 'parent': 'workSpaces.delete', 'child': 'workSpaces.removeApplet' },
                    { 'parent': 'workSpaces.delete', 'child': 'workSpaces.removeApplet' },
                    //---
                    { 'parent': 'workSpaces.create', 'child': 'workSpaces.index' },
                    { 'parent': 'workSpaces.update', 'child': 'workSpaces.index' },
                    { 'parent': 'workSpaces.delete', 'child': 'workSpaces.index' },
                    { 'parent': 'workSpaces.index', 'child': 'workSpaces.view' },
                    { 'parent': 'workSpaces.index', 'child': 'workSpaces.getNotPersonal' },

                ]
            },
            { // Applets Management
                permissionItems: [
                    { title: 'Applets', controller: "applets", action: "*", weight: 1, description: "Create Read Update and delete applets." },
                    { title: 'Create', controller: "applets", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "applets", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "applets", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "applets", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "applets", action: "view", weight: 7, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'applets.*', 'child': 'applets.index' },
                    { 'parent': 'applets.*', 'child': 'applets.update' },
                    { 'parent': 'applets.*', 'child': 'applets.create' },
                    { 'parent': 'applets.*', 'child': 'applets.delete' },
                    { 'parent': 'applets.create', 'child': 'applets.index' },
                    { 'parent': 'applets.update', 'child': 'applets.index' },
                    { 'parent': 'applets.delete', 'child': 'applets.index' },
                    { 'parent': 'applets.index', 'child': 'applets.view' },
                ]
            },
            { // List Management
                permissionItems: [
                    { title: 'Lists', controller: "lists", action: "*", weight: 1, description: "Create Read Update and delete lists." },
                    { title: 'Create', controller: "lists", action: "create", weight: 2, description: "" },
                    { title: 'Copy', controller: "lists", action: "copy", weight: 3, description: "" },
                    { title: 'Update', controller: "lists", action: "update", weight: 4, description: "" },
                    { title: 'Move', controller: "lists", action: "move", weight: 5, description: "" },
                    { title: 'Share', controller: "lists", action: "share", weight: 6, description: "" },
                    { title: 'Update Order', controller: "lists", action: "updateOrder", weight: 7, description: "" },
                    { title: 'Delete', controller: "lists", action: "delete", weight: 8, description: "" },
                    { title: 'List', controller: "lists", action: "index", weight: 9, description: "" },
                    { title: 'Details', controller: "lists", action: "view", weight: 10, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'lists.*', 'child': 'lists.index' },
                    { 'parent': 'lists.*', 'child': 'lists.update' },
                    { 'parent': 'lists.*', 'child': 'lists.create' },
                    { 'parent': 'lists.*', 'child': 'lists.delete' },
                    { 'parent': 'lists.create', 'child': 'lists.copy' },
                    { 'parent': 'lists.create', 'child': 'lists.index' },
                    { 'parent': 'lists.update', 'child': 'lists.move' },
                    { 'parent': 'lists.update', 'child': 'lists.updateOrder' },
                    { 'parent': 'lists.update', 'child': 'lists.index' },
                    { 'parent': 'lists.delete', 'child': 'lists.index' },
                    { 'parent': 'lists.index', 'child': 'lists.view' },
                    { 'parent': 'lists.index', 'child': 'lists.share' },
                ]
            },
            { // List Item Management
                permissionItems: [
                    { title: 'List Items', controller: "listItems", action: "*", weight: 1, description: "Create Read Update and delete list items." },
                    { title: 'Create', controller: "listItems", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "listItems", action: "update", weight: 3, description: "" },
                    { title: 'Update Order', controller: "listItems", action: "updateOrder", weight: 4, description: "" },
                    { title: 'Delete', controller: "listItems", action: "delete", weight: 5, description: "" },
                    { title: 'List', controller: "listItems", action: "index", weight: 6, description: "" },
                    { title: 'Details', controller: "listItems", action: "view", weight: 7, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'listItems.*', 'child': 'listItems.index' },
                    { 'parent': 'listItems.*', 'child': 'listItems.update' },
                    { 'parent': 'listItems.*', 'child': 'listItems.create' },
                    { 'parent': 'listItems.*', 'child': 'listItems.delete' },
                    { 'parent': 'listItems.create', 'child': 'listItems.index' },
                    { 'parent': 'listItems.update', 'child': 'listItems.updateOrder' },
                    { 'parent': 'listItems.update', 'child': 'listItems.index' },
                    { 'parent': 'listItems.delete', 'child': 'listItems.index' },
                    { 'parent': 'listItems.index', 'child': 'listItems.view' },
                ]
            },
            { // Task Groups Management
                permissionItems: [
                    { title: 'Task Groups', controller: "taskGroups", action: "*", weight: 1, description: "Create Read Update and delete task groups." },
                    { title: 'Create', controller: "taskGroups", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "taskGroups", action: "update", weight: 3, description: "" },
                    { title: 'Update Order', controller: "taskGroups", action: "updateOrder", weight: 4, description: "" },
                    { title: 'Delete', controller: "taskGroups", action: "delete", weight: 5, description: "" },
                    { title: 'List', controller: "taskGroups", action: "index", weight: 6, description: "" },
                    { title: 'Details', controller: "taskGroups", action: "view", weight: 7, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'taskGroups.*', 'child': 'taskGroups.index' },
                    { 'parent': 'taskGroups.*', 'child': 'taskGroups.update' },
                    { 'parent': 'taskGroups.*', 'child': 'taskGroups.create' },
                    { 'parent': 'taskGroups.*', 'child': 'taskGroups.delete' },
                    { 'parent': 'taskGroups.create', 'child': 'taskGroups.index' },
                    { 'parent': 'taskGroups.update', 'child': 'taskGroups.updateOrder' },
                    { 'parent': 'taskGroups.update', 'child': 'taskGroups.index' },
                    { 'parent': 'taskGroups.delete', 'child': 'taskGroups.index' },
                    { 'parent': 'taskGroups.index', 'child': 'taskGroups.view' },
                ]
            },
            { // Tasks Item Management
                permissionItems: [
                    { title: 'Tasks', controller: "tasks", action: "*", weight: 1, description: "Create Read Update and delete tasks." },
                    { title: 'Create', controller: "tasks", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "tasks", action: "update", weight: 3, description: "" },
                    { title: 'Update Order', controller: "tasks", action: "updateOrder", weight: 4, description: "" },
                    { title: 'Delete', controller: "tasks", action: "delete", weight: 5, description: "" },
                    { title: 'List', controller: "tasks", action: "index", weight: 6, description: "" },
                    { title: 'Details', controller: "tasks", action: "view", weight: 7, description: "" },
                    //task comments
                    { title: 'Add Comment', controller: "tasks", action: "addComment", weight: 8, description: "" },
                    { title: 'Update Comment', controller: "tasks", action: "updateComment", weight: 8, description: "" },
                    { title: 'Remove  Comment', controller: "tasks", action: "removeComment", weight: 8, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'tasks.*', 'child': 'tasks.index' },
                    { 'parent': 'tasks.*', 'child': 'tasks.update' },
                    { 'parent': 'tasks.*', 'child': 'tasks.create' },
                    { 'parent': 'tasks.*', 'child': 'tasks.delete' },
                    { 'parent': 'tasks.create', 'child': 'tasks.index' },

                    { 'parent': 'tasks.create', 'child': 'tasks.addComment' },
                    { 'parent': 'tasks.create', 'child': 'tasks.updateComment' },
                    { 'parent': 'tasks.create', 'child': 'tasks.removeComment' },

                    { 'parent': 'tasks.update', 'child': 'tasks.addComment' },
                    { 'parent': 'tasks.update', 'child': 'tasks.updateComment' },
                    { 'parent': 'tasks.update', 'child': 'tasks.removeComment' },

                    { 'parent': 'tasks.delete', 'child': 'tasks.addComment' },
                    { 'parent': 'tasks.delete', 'child': 'tasks.updateComment' },
                    { 'parent': 'tasks.delete', 'child': 'tasks.removeComment' },

                    { 'parent': 'tasks.update', 'child': 'tasks.updateOrder' },
                    { 'parent': 'tasks.update', 'child': 'tasks.index' },
                    { 'parent': 'tasks.delete', 'child': 'tasks.index' },
                    { 'parent': 'tasks.index', 'child': 'tasks.view' },
                ]
            },
            { // Approvals Management
                permissionItems: [
                    { title: 'Approvals', controller: "approvals", action: "*", weight: 1, description: "Create Read Update and delete task groups." },
                    { title: 'Create', controller: "approvals", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "approvals", action: "update", weight: 3, description: "" },
                    { title: 'Update Order', controller: "approvals", action: "updateOrder", weight: 4, description: "" },
                    { title: 'Delete', controller: "approvals", action: "delete", weight: 5, description: "" },
                    { title: 'List', controller: "approvals", action: "index", weight: 6, description: "" },
                    { title: 'Details', controller: "approvals", action: "view", weight: 7, description: "" },

                ],
                permissionChildren: [
                    { 'parent': 'approvals.*', 'child': 'approvals.index' },
                    { 'parent': 'approvals.*', 'child': 'approvals.update' },
                    { 'parent': 'approvals.*', 'child': 'approvals.create' },
                    { 'parent': 'approvals.*', 'child': 'approvals.delete' },
                    { 'parent': 'approvals.create', 'child': 'approvals.index' },
                    { 'parent': 'approvals.update', 'child': 'approvals.updateOrder' },
                    { 'parent': 'approvals.update', 'child': 'approvals.index' },
                    { 'parent': 'approvals.delete', 'child': 'approvals.index' },
                    { 'parent': 'approvals.index', 'child': 'approvals.view' },
                ]
            },
        ]
    },
    {
        name: 'Settings',
        description: 'Security Module description',
        status: true,
        weight: 1,
        modulePermissions: [
            { // Role Management
                permissionItems: [
                    { title: 'Roles', controller: "roles", action: "*", weight: 1, description: "Create Read Update and delete roles." },
                    { title: 'Create', controller: "roles", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "roles", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "roles", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "roles", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "roles", action: "view", weight: 6, description: "" },
                    { title: 'Modules List', controller: "module", action: "index", weight: 7, description: "" },
                    { title: 'Permissions List', controller: "permission", action: "findByModule", weight: 8, description: "" }
                ],
                permissionChildren: [
                    { 'parent': 'roles.*', 'child': 'roles.index' },
                    { 'parent': 'roles.*', 'child': 'roles.update' },
                    { 'parent': 'roles.*', 'child': 'roles.create' },
                    { 'parent': 'roles.*', 'child': 'roles.delete' },
                    { 'parent': 'roles.create', 'child': 'roles.index' },
                    { 'parent': 'roles.update', 'child': 'roles.index' },
                    { 'parent': 'roles.delete', 'child': 'roles.index' },
                    { 'parent': 'roles.index', 'child': 'roles.view' },
                    { 'parent': 'roles.view', 'child': 'modules.index' },
                    { 'parent': 'roles.view', 'child': 'permissions.findByModule' }
                ]
            },
            { // User Management
                permissionItems: [
                    { title: 'Users', controller: "users", action: "*", weight: 1, description: "Create Read Update and delete users." },
                    { title: 'Create', controller: "users", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "users", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "users", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "users", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "users", action: "view", weight: 6, description: "" },
                    { title: 'Auto Complete', controller: "users", action: "auto-complete", weight: 7, description: "auto-complete" },
                    { title: 'Get Selected Users', controller: "users", action: "selected", weight: 8, description: "auto-complete" },

                ],
                permissionChildren: [
                    { 'parent': 'users.*', 'child': 'users.index' },
                    { 'parent': 'users.*', 'child': 'users.update' },
                    { 'parent': 'users.*', 'child': 'users.create' },
                    { 'parent': 'users.*', 'child': 'users.delete' },
                    { 'parent': 'users.create', 'child': 'users.index' },
                    { 'parent': 'users.update', 'child': 'users.index' },
                    { 'parent': 'users.delete', 'child': 'users.index' },
                    { 'parent': 'users.index', 'child': 'users.view' },
                    { 'parent': 'users.index', 'child': 'users.auto-complete' },
                    { 'parent': 'users.index', 'child': 'users.selected' }
                ]
            },
            { // Business Groups / Verticles
                permissionItems: [
                    { title: 'Business Groups', controller: "businessGroups", action: "*", weight: 1, description: "Create Read Update and delete business groups." },
                    { title: 'Create', controller: "businessGroups", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "businessGroups", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "businessGroups", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "businessGroups", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "businessGroups", action: "view", weight: 6, description: "" }
                ],
                permissionChildren: [
                    { 'parent': 'businessGroups.*', 'child': 'businessGroups.index' },
                    { 'parent': 'businessGroups.*', 'child': 'businessGroups.update' },
                    { 'parent': 'businessGroups.*', 'child': 'businessGroups.create' },
                    { 'parent': 'businessGroups.*', 'child': 'businessGroups.delete' },
                    { 'parent': 'businessGroups.create', 'child': 'businessGroups.index' },
                    { 'parent': 'businessGroups.update', 'child': 'businessGroups.index' },
                    { 'parent': 'businessGroups.delete', 'child': 'businessGroups.index' },
                    { 'parent': 'businessGroups.index', 'child': 'businessGroups.view' }
                ]
            },
            { // Status Flows
                permissionItems: [
                    { title: 'Status Flows', controller: "statusFlows", action: "*", weight: 1, description: "Create Read Update and delete status flows." },
                    { title: 'Create', controller: "statusFlows", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "statusFlows", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "statusFlows", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "statusFlows", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "statusFlows", action: "view", weight: 6, description: "" }
                ],
                permissionChildren: [
                    { 'parent': 'statusFlows.*', 'child': 'statusFlows.index' },
                    { 'parent': 'statusFlows.*', 'child': 'statusFlows.update' },
                    { 'parent': 'statusFlows.*', 'child': 'statusFlows.create' },
                    { 'parent': 'statusFlows.*', 'child': 'statusFlows.delete' },
                    { 'parent': 'statusFlows.create', 'child': 'statusFlows.index' },
                    { 'parent': 'statusFlows.update', 'child': 'statusFlows.index' },
                    { 'parent': 'statusFlows.delete', 'child': 'statusFlows.index' },
                    { 'parent': 'statusFlows.index', 'child': 'statusFlows.view' }
                ]
            },
            { // Tags
                permissionItems: [
                    { title: 'Tags', controller: "tags", action: "*", weight: 1, description: "Create Read Update and delete Tags." },
                    { title: 'Create', controller: "tags", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "tags", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "tags", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "tags", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "tags", action: "view", weight: 6, description: "" },
                    { title: 'Get Types', controller: "tags", action: "types", weight: 6, description: "" }
                ],
                permissionChildren: [
                    { 'parent': 'tags.*', 'child': 'tags.index' },
                    { 'parent': 'tags.*', 'child': 'tags.update' },
                    { 'parent': 'tags.*', 'child': 'tags.create' },
                    { 'parent': 'tags.*', 'child': 'tags.delete' },
                    { 'parent': 'tags.create', 'child': 'tags.index' },
                    { 'parent': 'tags.update', 'child': 'tags.index' },
                    { 'parent': 'tags.delete', 'child': 'tags.index' },
                    { 'parent': 'tags.index', 'child': 'tags.view' },
                    { 'parent': 'tags.view', 'child': 'tags.types' }
                ]
            },
            { // MailServer
                permissionItems: [
                    { title: 'Mail Servers', controller: "mailServers", action: "*", weight: 1, description: "Create Read Update and delete mail servers." },
                    { title: 'Create', controller: "mailServers", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "mailServers", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "mailServers", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "mailServers", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "mailServers", action: "view", weight: 6, description: "" }
                ],
                permissionChildren: [
                    { 'parent': 'mailServers.*', 'child': 'mailServers.index' },
                    { 'parent': 'mailServers.*', 'child': 'mailServers.update' },
                    { 'parent': 'mailServers.*', 'child': 'mailServers.create' },
                    { 'parent': 'mailServers.*', 'child': 'mailServers.delete' },
                    { 'parent': 'mailServers.create', 'child': 'mailServers.index' },
                    { 'parent': 'mailServers.update', 'child': 'mailServers.index' },
                    { 'parent': 'mailServers.delete', 'child': 'mailServers.index' },
                    { 'parent': 'mailServers.index', 'child': 'mailServers.view' },
                    { 'parent': 'mailServers.view', 'child': 'mailServers.types' }
                ]
            }
        ]
    },
    {
        name: 'Business Ops',
        description: 'Business Operations: Lead management system',
        status: true,
        weight: 1,
        modulePermissions: [
            {
                // Lead Management
                permissionItems: [
                    { title: 'Leads', controller: "leads", action: "*", weight: 1, description: "Create Read Update and delete leads." },
                    { title: 'Create', controller: "leads", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "leads", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "leads", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "leads", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "leads", action: "view", weight: 6, description: "" },
                    { title: 'Get Technologies', controller: "lead", action: "technologies", weight: 7, description: "" },
                    { title: 'Get Time Zones', controller: "lead", action: "timeZones", weight: 8, description: "" },
                    { title: 'Get Time Zone By ID', controller: "lead", action: "viewTimeZone", weight: 9, description: "" },
                    { title: 'Get Business Groups By User', controller: "lead", action: "viewBusinessGroupsByCurrentUser", weight: 10, description: "" },
                    { title: 'Get Leads Group By status', controller: "lead", action: "viewLeadsGroupGroupByStatus", weight: 11, description: "" },


                ],
                permissionChildren: [
                    { 'parent': 'leads.*', 'child': 'leads.index' },
                    { 'parent': 'leads.*', 'child': 'leads.update' },
                    { 'parent': 'leads.*', 'child': 'leads.create' },
                    { 'parent': 'leads.*', 'child': 'leads.delete' },
                    { 'parent': 'leads.create', 'child': 'leads.index' },
                    { 'parent': 'leads.update', 'child': 'leads.index' },
                    { 'parent': 'leads.delete', 'child': 'leads.index' },
                    { 'parent': 'leads.index', 'child': 'leads.view' },
                    { 'parent': 'leads.view', 'child': 'leads.technologies' },
                    { 'parent': 'leads.view', 'child': 'leads.timeZones' },
                    { 'parent': 'leads.view', 'child': 'leads.viewTimeZone' },
                    { 'parent': 'leads.view', 'child': 'leads.viewBusinessGroupsByCurrentUser' },
                    { 'parent': 'leads.view', 'child': 'leads.viewOpportunitiesGroupGroupByStatus' },
                    { 'parent': 'leads.view', 'child': 'contacts.index' },
                    { 'parent': 'leads.view', 'child': 'companies.view' }, // for leads form we need company.view
                ]
            },
            {
                // Account Management
                permissionItems: [
                    { title: 'Accounts', controller: "accounts", action: "*", weight: 1, description: "Create Read Update and delete accounts." },
                    { title: 'Create', controller: "accounts", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "accounts", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "accounts", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "accounts", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "accounts", action: "view", weight: 6, description: "" },
                    { title: 'Get Technologies', controller: "account", action: "technologies", weight: 7, description: "" },
                    { title: 'Get Time Zones', controller: "account", action: "timeZones", weight: 8, description: "" },
                    { title: 'Get Time Zone By ID', controller: "account", action: "viewTimeZone", weight: 9, description: "" },
                    { title: 'Get Business Groups By User', controller: "account", action: "viewBusinessGroupsByCurrentUser", weight: 10, description: "" },
                    { title: 'Get Accounts Group By status', controller: "account", action: "viewAccountsGroupGroupByStatus", weight: 11, description: "" },


                ],
                permissionChildren: [
                    { 'parent': 'accounts.*', 'child': 'accounts.index' },
                    { 'parent': 'accounts.*', 'child': 'accounts.update' },
                    { 'parent': 'accounts.*', 'child': 'accounts.create' },
                    { 'parent': 'accounts.*', 'child': 'accounts.delete' },
                    { 'parent': 'accounts.create', 'child': 'accounts.index' },
                    { 'parent': 'accounts.update', 'child': 'accounts.index' },
                    { 'parent': 'accounts.delete', 'child': 'accounts.index' },
                    { 'parent': 'accounts.index', 'child': 'accounts.view' },
                    { 'parent': 'accounts.view', 'child': 'accounts.technologies' },
                    { 'parent': 'accounts.view', 'child': 'accounts.timeZones' },
                    { 'parent': 'accounts.view', 'child': 'accounts.viewTimeZone' },
                    { 'parent': 'accounts.view', 'child': 'accounts.viewBusinessGroupsByCurrentUser' },
                    { 'parent': 'accounts.view', 'child': 'accounts.viewOpportunitiesGroupGroupByStatus' },
                    { 'parent': 'accounts.view', 'child': 'contacts.index' },
                    { 'parent': 'accounts.view', 'child': 'companies.view' }, // for accounts form we need company.view
                ]
            },
            {
                // Opportunites Management
                permissionItems: [
                    { title: 'Opportunites', controller: "opportunities", action: "*", weight: 1, description: "Create Read Update and delete opportunties." },
                    { title: 'Create', controller: "opportunities", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "opportunities", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "opportunities", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "opportunities", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "opportunities", action: "view", weight: 6, description: "" },
                    { title: 'Get Technologies', controller: "opportunities", action: "technologies", weight: 7, description: "" },
                    { title: 'Get Time Zones', controller: "opportunities", action: "timeZones", weight: 8, description: "" },
                    { title: 'Get Time Zone By ID', controller: "opportunities", action: "viewTimeZone", weight: 9, description: "" },
                    { title: 'Get Business Groups By User', controller: "opportunities", action: "viewBusinessGroupsByCurrentUser", weight: 10, description: "" },
                    { title: 'Get Leads Group By status', controller: "opportunities", action: "viewOpportunitiesGroupGroupByStatus", weight: 11, description: "" },


                ],
                permissionChildren: [
                    { 'parent': 'opportunities.*', 'child': 'opportunities.index' },
                    { 'parent': 'opportunities.*', 'child': 'opportunities.update' },
                    { 'parent': 'opportunities.*', 'child': 'opportunities.create' },
                    { 'parent': 'opportunities.*', 'child': 'opportunities.delete' },
                    { 'parent': 'opportunities.create', 'child': 'opportunities.index' },
                    { 'parent': 'opportunities.update', 'child': 'opportunities.index' },
                    { 'parent': 'opportunities.delete', 'child': 'opportunities.index' },
                    { 'parent': 'opportunities.index', 'child': 'opportunities.view' },
                    { 'parent': 'opportunities.view', 'child': 'opportunities.technologies' },
                    { 'parent': 'opportunities.view', 'child': 'opportunities.timeZones' },
                    { 'parent': 'opportunities.view', 'child': 'opportunities.viewTimeZone' },
                    { 'parent': 'opportunities.view', 'child': 'opportunities.viewBusinessGroupsByCurrentUser' },
                    { 'parent': 'opportunities.view', 'child': 'opportunities.viewOpportunitiesGroupGroupByStatus' },
                    { 'parent': 'opportunities.view', 'child': 'contacts.index' },
                    { 'parent': 'opportunities.view', 'child': 'companies.view' }, // for opportunities form we need company.view
                ]
            },
            { // Contact Management
                permissionItems: [
                    { title: 'Contacts', controller: "contacts", action: "*", weight: 1, description: "Create Read Update and delete Contact." },
                    { title: 'Create', controller: "contacts", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "contacts", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "contacts", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "contacts", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "contacts", action: "view", weight: 6, description: "" },
                ],
                permissionChildren: [
                    { 'parent': 'contacts.*', 'child': 'contacts.index' },
                    { 'parent': 'contacts.*', 'child': 'contacts.update' },
                    { 'parent': 'contacts.*', 'child': 'contacts.create' },
                    { 'parent': 'contacts.*', 'child': 'contacts.delete' },
                    { 'parent': 'contacts.create', 'child': 'contacts.index' },
                    { 'parent': 'contacts.update', 'child': 'contacts.index' },
                    { 'parent': 'contacts.delete', 'child': 'contacts.index' },
                    { 'parent': 'contacts.index', 'child': 'contacts.view' },
                    { 'parent': 'contacts.view', 'child': 'leads.index' },
                ]
            },
            { // Contact Management
                permissionItems: [
                    { title: 'Companies', controller: "companies", action: "*", weight: 1, description: "Create Read Update and delete Company." },
                    { title: 'Create', controller: "companies", action: "create", weight: 2, description: "" },
                    { title: 'Update', controller: "companies", action: "update", weight: 3, description: "" },
                    { title: 'Delete', controller: "companies", action: "delete", weight: 4, description: "" },
                    { title: 'List', controller: "companies", action: "index", weight: 5, description: "" },
                    { title: 'Details', controller: "companies", action: "view", weight: 6, description: "" },
                ],
                permissionChildren: [
                    { 'parent': 'companies.*', 'child': 'companies.index' },
                    { 'parent': 'companies.*', 'child': 'companies.update' },
                    { 'parent': 'companies.*', 'child': 'companies.create' },
                    { 'parent': 'companies.*', 'child': 'companies.delete' },
                    { 'parent': 'companies.create', 'child': 'companies.index' },
                    { 'parent': 'companies.update', 'child': 'companies.index' },
                    { 'parent': 'companies.delete', 'child': 'companies.index' },
                    { 'parent': 'companies.index', 'child': 'companies.view' },
                ]
            }
        ]
    }
]