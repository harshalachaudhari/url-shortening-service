export interface IUrlRequestDetails {
    urlId?: string;
    longUrl?: string;
}

export interface IUserRequest {
    email: string,
    password: string,
    isAdmin: boolean,
    token?: string
    name?: string
}