export const PermissionData = {
    Security: {
        name: 'Security',
        description: 'Security Module description',
        status: true,
        weight: 1,
        Permissions: {
            Module: {
                'Detail View': {
                    controller: "module",
                    action: "view",
                    weight: 1,
                },
                'List All': {
                    controller: "module",
                    action: "index",
                    children: ["module.view"],
                    weight: 2,
                    coreChild: true
                },
                'Delete': {
                    controller: "module",
                    action: "delete",
                    children: ["module.index"],
                    weight: 3,
                    coreChild: true
                },
                'Update': {
                    controller: "module",
                    action: "update",
                    children: ["module.index"],
                    weight: 4,
                    coreChild: true
                },
                'Create New': {
                    controller: "module",
                    action: "create",
                    children: ["module.index"],
                    weight: 5,
                    coreChild: true
                }
            },
            Role: {
                'Detail View': {
                    controller: "role",
                    action: "view",
                    weight: 1,
                },
                'List All': {
                    controller: "role",
                    action: "index",
                    children: ["role.view"],
                    weight: 2,
                    coreChild: true
                },
                'Delete': {
                    controller: "role",
                    action: "delete",
                    children: ["role.index"],
                    weight: 3,
                    coreChild: true
                },
                'Update': {
                    controller: "role",
                    action: "update",
                    children: ["role.index"],
                    weight: 4,
                    coreChild: true
                },
                'Create New': {
                    controller: "role",
                    action: "create",
                    children: ["role.index"],
                    weight: 5,
                    coreChild: true
                }
            },
            Permission: {
                'Detail View': {
                    controller: "permission",
                    action: "view",
                    weight: 1,
                },
                'List All': {
                    controller: "permission",
                    action: "index",
                    children: ["permission.view"],
                    weight: 2,
                    coreChild: true
                },
                'Delete': {
                    controller: "permission",
                    action: "delete",
                    children: ["permission.index"],
                    weight: 3,
                    coreChild: true
                },
                'Update': {
                    controller: "permission",
                    action: "update",
                    children: ["permission.index"],
                    weight: 4,
                    coreChild: true
                },
                'Create New': {
                    controller: "permission",
                    action: "create",
                    children: ["permission.index"],
                    weight: 5,
                    coreChild: true
                }
            },
            User: {
                'View': {
                    controller: "user",
                    action: "view",
                    weight: 1,
                },
                'List All': {
                    controller: "user",
                    action: "index",
                    children: ["user.view"],
                    weight: 2,
                    coreChild: true
                },
                'Delete': {
                    controller: "user",
                    action: "delete",
                    children: ["user.index"],
                    weight: 3,
                    coreChild: true
                },
                'Update': {
                    controller: "user",
                    action: "update",
                    children: ["user.index"],
                    weight: 4,
                    coreChild: true
                },
                'Create New': {
                    controller: "user",
                    action: "create",
                    children: ["user.index"],
                    weight: 5,
                    coreChild: true
                }
            },
        }
    }
    // Leads: {
    //     name: 'Leads',
    //     description: 'Leads Module',
    //     status: true,
    //     Permissions: {
    //         Leads: {
    //             'View Lead': {
    //                 controller: "leads",
    //                 action: "view"
    //             },
    //             'List All Leads': {
    //                 controller: "leads",
    //                 action: "index",
    //                 children: ["leads.view"]
    //             },
    //             'Create New Lead': {
    //                 controller: "leads",
    //                 action: "create",
    //                 children: ["leads.index"]
    //             },
    //             'Update Lead': {
    //                 controller: "leads",
    //                 action: "update",
    //                 children: ["leads.index"]
    //             },
    //             'Delete Lead': {
    //                 controller: "leads",
    //                 action: "delete",
    //                 children: ["leads.index"]
    //             }
    //         }
    //     }
    // }
}