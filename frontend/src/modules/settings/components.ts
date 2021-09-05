import {
    //services
    RoleService,
    UserService,
    ProfileService,
    BusinessGroupService,
    TagService,
    StatusFlowService,
    ReleaseService,
    MailServerService,
    RolePermissionService,

    // Componenets
    RoleIndexComponent,
    RoleFormComponent,
    RoleViewComponent,
    UserFormComponent,
    UserRolesComponent,
    UserBusinessGroupsComponent,
    UserIndexComponent,
    UserViewComponent,
    PermissionsComponent,
    ChangePasswordComponent,
    ProfileFormComponent,
    BusinessGroupFormComponent,
    BusinessGroupIndexComponent,
    LeadStatusComponent,LeadStatusDialogComponent,
    OpportunityStatusComponent,OpportunityStatusDialogComponent,
    TagFormComponent,
    TagIndexComponent,
    MailServerFormComponent,MailServerIndexComponent,MailServerTestComponent,
    ReleaseIndexComponent, ReleaseFormComponent,

    ManagePermissionsComponent,

    //Directives
    ValidateOnBlurDirective
} from './';

export const MODULE_COMPONENTS = [
    RoleIndexComponent,
    RoleFormComponent,
    RoleViewComponent,
    UserFormComponent,
    UserRolesComponent,
    UserBusinessGroupsComponent,
    UserIndexComponent,
    UserViewComponent,
    PermissionsComponent,
    ChangePasswordComponent,
    ProfileFormComponent,
    BusinessGroupFormComponent,
    BusinessGroupIndexComponent,
    LeadStatusComponent, LeadStatusDialogComponent,
    OpportunityStatusComponent,OpportunityStatusDialogComponent,
    TagFormComponent,
    TagIndexComponent,
    ReleaseIndexComponent, ReleaseFormComponent,
    MailServerFormComponent,MailServerIndexComponent,MailServerTestComponent,
    
    ManagePermissionsComponent
];

export const MODULE_PROVIDERS = [
    RoleService,
    UserService,
    BusinessGroupService,
    ProfileService,
    TagService,
    ValidateOnBlurDirective,
    StatusFlowService,
    ReleaseService,
    MailServerService,
    RolePermissionService
]
export const ENTRY_PROVIDERS = [
    LeadStatusDialogComponent,
    OpportunityStatusDialogComponent
]