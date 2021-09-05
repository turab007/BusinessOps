import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
    selector: '[ifPermitted]'
})
/**
 * This directive class is responsible for checking the permission and if found then render the view.
 * 
 * how to use?
 * <div *ifPermitted="'permission_name'">
 *      Your content is here...
 * </div>
 * 
 * @class IfPermittedDirective
 */
export class IfPermittedDirective {

    /**
     * Input permission name provided when using the directive.
     */
    @Input("ifPermitted") permissionName: string;

    /**
     * @constructor
     * @param templateRef TemplateRef
     * @param viewContainer ViewContainerRef
     */
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    /**
     * On Init check the permissin.
     */
    ngOnInit() {

        if (localStorage.getItem('perm') == 'admin') {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    
        if (this.permissionName && localStorage.getItem('perm').indexOf(this.permissionName) > -1) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}