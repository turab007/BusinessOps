export interface MailServer {
    _id?: string,
    host?: string,
    port?: string,
    title?: string,
    user_name: string,
    password: string,
    is_gmail: boolean
    description?: string
}