import * as express from "express";
import {
    UserRoutes, LoginRoutes, ModuleRoutes, RoleRoutes, ProfileRoutes, PermissionRoutes, RolePermissionRoutes,
    UserRoleRoutes, BusinessGroupRoutes, LeadRoutes, TagRoutes, ContactRoutes, CompanyRoutes,
    StatusFlowRoutes, ReleaseRoutes, MailServerRoutes, OpportunityRoutes, AccountRoutes, WorkSpaceRoutes,
    AppletRoutes, ListItemRoutes, ListRoutes, TaskGroupRoutes, TaskRoutes, ActivityLogRoutes, ApprovalRoutes, EodRoutes,
    RoleWorkspacePermissionRoutes, EmployeeRoutes
} from "./";

import fs = require("fs")
import path = require('path');

var app = express();
// TODO:low (it was not working on middlewares, need to find best way set following line to set in middlewares)
app.set('views', path.join(fs.realpathSync(`${__dirname}/../../../views/`)));

/**
 * Include all route classes and use them here.
 * 
 * @class BaseRoutes
 */
class BaseRoutes {

    get routes() {
        app.use("/", new AccountRoutes().routes);
        app.use("/", new AppletRoutes().routes);
        app.use("/", new ApprovalRoutes().routes);
        app.use("/", new BusinessGroupRoutes().routes);
        app.use("/", new ContactRoutes().routes);
        app.use("/", new CompanyRoutes().routes);
        app.use("/", new LeadRoutes().routes);
        app.use("/", new LoginRoutes().routes);
        app.use("/", new ListRoutes().routes);
        app.use("/", new ListItemRoutes().routes);
        app.use("/", new LoginRoutes().routes);
        app.use("/", new MailServerRoutes().routes);
        app.use("/", new ModuleRoutes().routes);
        app.use("/", new OpportunityRoutes().routes);
        app.use("/", new ProfileRoutes().routes);
        app.use("/", new RoleRoutes().routes);
        app.use("/", new PermissionRoutes().routes);
        app.use("/", new RolePermissionRoutes().routes);
        app.use("/", new ReleaseRoutes().routes);
        app.use("/", new StatusFlowRoutes().routes);
        app.use("/", new TagRoutes().routes);
        app.use("/", new TaskGroupRoutes().routes);
        app.use("/", new TaskRoutes().routes);
        app.use("/", new UserRoleRoutes().routes);
        app.use("/", new UserRoutes().routes);
        app.use("/", new WorkSpaceRoutes().routes);
        app.use('/', new ActivityLogRoutes().routes);
        app.use('/', new EodRoutes().routes);
        app.use("/", new RoleWorkspacePermissionRoutes().routes);
        app.use("/", new EmployeeRoutes().routes);


        return app;
    } 
}
export { BaseRoutes };