export interface Carpeta {
    nom: string;
    subCarpetes: Carpeta[];
    videos: any[];
}

export interface User {
    username: string;
    password: string;
    name: string;
    surname: string;
    mainCarpeta: Carpeta;
}
