export interface FileDTO {
    path: string,
    nom: string,
    nouNom: string
}

export interface ShareFileDTO {
    fitxerId: string, //id del fitxer a compartir
    username: string, //username del usuari amb qui el volem compartir
}
