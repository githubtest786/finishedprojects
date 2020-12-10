export class SuccesfullLoginServerResponse {
    public constructor (
        public token?:string,
        public userType?:string,
        public name?: string,
    ){}
}