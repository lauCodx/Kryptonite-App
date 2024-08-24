export interface imgFile {
    _id: string;
    img:{
        name:string;
        data:string;
        contentType: string;
    };
    user_id:string
}