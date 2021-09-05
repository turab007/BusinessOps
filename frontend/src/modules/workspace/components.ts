import {
    AppletDialogueComponent,
    WorkSpaceComponent,
    FocusDirective,

    EodReportsHomeComponent,
    FormAddEodComponent,
    ViewEodReportComponent,
    EodReportsComponent,


    ListComponent,
    ListItemComponent,
    FormListDialogueComponent,
    CopyListDialogueComponent,
    ShareListDialogComponent,

    TasksHomeComponent,
    TaskGroupTaskComponent,
    TaskAddFormComponent,
    FormTaskGroupComponent,
    FormTaskCommentComponent,
    TaskViewComponent,
    TaskViewActivityComponent,
    TaskViewCommentsComponent,
    TaskViewAttachmentsComponent,
    TaskViewInfoComponent,
    AssignTaskDialogComponent,
    TaskEditInfoComponent,

    ApprovalComponent,
    ApprovalsHomeComponent,
    ApprovalViewComponent,
    FormAddApprovalComponent,
    FormForwardApprovalComponent,
    FormApprovalCommentComponent,
    ApprovalViewCommentsComponent,
    ApprovalViewActivityComponent,
    ApprovalViewAttachmentsComponent,

    ManageGroupSettingsComponent,
    FormGroupSettingsComponent,


    //services
    AppletService,
    WorkspaceService,
    ListService,
    ListItemService,
    TaskGroupService,
    TaskService,
    ApprovalService,
    ActivityLogService,
    ManageGroupSettingsService,

    //view models
    WorkSpace,
    Applet,
    List,
    Comment,
    ListItem,
    TaskGroup,
    Task,
    ActivityLog,


} from './';



export const WORKSPACE_COMPONENTS = [
    WorkSpaceComponent,
    AppletDialogueComponent,

    //LIST COMPONENTS
    ListComponent,
    ListItemComponent,
    FormListDialogueComponent,
    CopyListDialogueComponent,
    ShareListDialogComponent,

    //TASK COMPONENTS
    TasksHomeComponent,
    TaskGroupTaskComponent,
    FormTaskGroupComponent,
    FormTaskCommentComponent,
    TaskAddFormComponent,
    TaskViewComponent,
    TaskViewInfoComponent,
    TaskViewActivityComponent,
    TaskViewAttachmentsComponent,
    TaskViewCommentsComponent,
    AssignTaskDialogComponent,
    TaskEditInfoComponent,
    

    //EOD COMPONENTS
    EodReportsHomeComponent,
    FormAddEodComponent,
    ViewEodReportComponent,
    EodReportsComponent,

    //APPROVAL COMPONENTS
    ApprovalsHomeComponent,
    ApprovalViewComponent,
    FormAddApprovalComponent,
    FormForwardApprovalComponent,
    ApprovalComponent,
    FormApprovalCommentComponent,
    ApprovalViewCommentsComponent,
    ApprovalViewActivityComponent,
    ApprovalViewAttachmentsComponent,

    //MANAGE GROUSPACE COMPONENTS
    ManageGroupSettingsComponent,
    FormGroupSettingsComponent,
];

export const WORKSPACE_PROVIDERS = [
    WorkspaceService,
    AppletService,
    TaskService,
    ListService,
    ListItemService,
    TaskGroupService,
    ApprovalService,
    ActivityLogService,
    ManageGroupSettingsService
];

export const WORKSPACE_DIRECTIVES = [
    FocusDirective
];

export const ENTRY_PROVIDERS = [
    AppletDialogueComponent,

    FormListDialogueComponent,
    CopyListDialogueComponent,
    ShareListDialogComponent,

    FormTaskGroupComponent,
    FormTaskCommentComponent,
    AssignTaskDialogComponent,
    TaskAddFormComponent,
    TaskEditInfoComponent,

    FormAddApprovalComponent,
    FormForwardApprovalComponent,
    FormApprovalCommentComponent,

    FormAddEodComponent,
    ViewEodReportComponent,

    FormGroupSettingsComponent
];