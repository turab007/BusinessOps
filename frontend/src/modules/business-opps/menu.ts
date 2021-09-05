/**
 * Purpose of this file to seperate the menu of each module. 
 * 
 */


export let menuArr =
    {
        module: 'Business Opps',
        description: 'Business Opps Module description',
        sub_module: '',

        links: [
            { title: 'Leads', route: '/business-opps/leads/', icon: 'business' },
            // { title: 'Leads Kanban', route: '/business-opps/leads/kanban/', icon: 'business' },
            { title: 'Opportunities', route: '/business-opps/opportunities/', icon: 'business' },
            // { title: 'Opportunities Kanban', route: '/business-opps/opportunities/kanban/', icon: 'business' },
            { title: 'Contacts', route: '/business-opps/contacts/', icon: 'contacts' },
            { title: 'Companies', route: '/business-opps/companies/', icon: 'business' },
            { title: 'Accounts', route: '#', icon: 'account_box' },

        ]
    }

