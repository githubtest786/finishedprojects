export class UserDetails {
    public constructor(
        public username_email?:string,
        public id_number?: number,
        public password?:string,
        public city?:string,
        public street?:string,
        public first_name?: string,
        public last_name?: string,
        public role?: string
    ){}
}