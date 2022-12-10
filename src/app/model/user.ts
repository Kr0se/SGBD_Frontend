export interface Fitxer {
    nom: string;
    dataPujada: number;
    id: string;
    fitxerDBId: string;
    tipus: string
}

export interface Carpeta {
    nom: string;
    subCarpetes: Carpeta[];
    files: Fitxer[];
}

export interface User {
    username: string;
    password: string;
    name: string;
    surname: string;
    mainCarpeta: Carpeta;
}
