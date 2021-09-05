/**
 * Contains configurations
 * 
 * @class Constants
 */
class Constants {

    static DB_CONNECTION_STRING: string = "mongodb://localhost/group_captain";

    static devEnvironments: boolean = true;

    static jwtTokenSecret = "#Gr0upC@pt@|n";

    //TODO:Low (Team meeting will confirm for these actions place)
    static publicActions = ['/login', '/forgot-password', '/verification', '/reset-password', 
    '/verify-reset-password', '/tasks/downloadAttachment/','/approvals/downloadAttachment/'];

    static tagTypes = ['Technologies', 'Professions'];


}
Object.seal(Constants);
export = Constants;
