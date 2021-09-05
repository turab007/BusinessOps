import {
    NavComponent,
    PageComponent,
    FullLayoutComponent,
    LayoutService,
    TokenService,
    FlashService,
    SideNavService
} from './';

export const LAYOUT_COMPONENTS = [
    NavComponent,
    PageComponent,
    FullLayoutComponent
];

export const LAYOUT_PROVIDERS = [
    LayoutService,
    TokenService,
    FlashService,
    SideNavService 
]