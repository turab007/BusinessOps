import {
    //services
    LeadService,
    OpportunityService,
    ContactService,
    CompanyService,
    AccountService,


    // Componenets
    LeadFormComponent, LeadIndexComponent, LeadsKanbanComponent,
    ContactModesComponent, LeadDetailActionComponent,
    LeadInterestsDialogComponent, LeadParticipantsDialogComponent,
    AccountDialogComponent,
    OpportunityFormComponent, OpportunityIndexComponent,
    OpportunitiesKanbanComponent, OpportunityContactModesComponent,
    LeadNotesComponent, LeadAttachmentsComponent,
    //account
    AccountFormComponent, AccountIndexComponent,
    AccountsKanbanComponent, AccountContactModesComponent,
    //
    ContactFormComponent,
    ContactIndexComponent,
    CompanyFormComponent,
    CompanyIndexComponent

    //Directives

} from './';

export const MODULE_COMPONENTS = [
    LeadFormComponent, LeadIndexComponent, LeadsKanbanComponent,
    ContactModesComponent, LeadDetailActionComponent,
    LeadInterestsDialogComponent, LeadParticipantsDialogComponent,
    AccountDialogComponent,
    OpportunityFormComponent, OpportunityIndexComponent,
    OpportunitiesKanbanComponent, OpportunityContactModesComponent,
    LeadNotesComponent, LeadAttachmentsComponent,
    //account
    AccountFormComponent, AccountIndexComponent,
    AccountsKanbanComponent, AccountContactModesComponent,
    //
    ContactFormComponent,
    ContactIndexComponent,
    CompanyFormComponent,
    CompanyIndexComponent
];

export const MODULE_PROVIDERS = [
    LeadService,
    OpportunityService,
    ContactService,
    CompanyService,
    AccountService
]

export const ENTRY_PROVIDERS = [
    LeadInterestsDialogComponent,
    LeadParticipantsDialogComponent,
    AccountDialogComponent
]