/**
 * Purpose of this file to seperate the menu of each module. 
 * 
 */


export let menuArr =
    {
        module: 'Settings',
        description: 'Settings Module description',
        sub_module: '',

        links: [
            { title: 'Users', route: '/settings/users', icon: 'people' },
            // { title: 'Roles', route: '/settings/roles', icon: 'view_module' },
            // { title: 'Business Groups', route: '/settings/business-groups', icon: 'business' },
            // { title: 'Tags', route: '/settings/tags', icon: 'list' },
            { title: 'Mail Server', route: '/settings/mail-servers', icon: 'list' },
            { title: 'Releases', route: '/settings/releases', icon: 'blur_linear' },
            { title: 'Permissions', route: '/settings/permissions', icon: 'security' },
        ]
    }

