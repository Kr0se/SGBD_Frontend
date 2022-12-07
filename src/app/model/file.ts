export interface Value {
    timestamp: number;
    date: number;
}

export interface Id {
    value: Value;
    bsonType: string;
    double: boolean;
    boolean: boolean;
    binary: boolean;
    number: boolean;
    array: boolean;
    null: boolean;
    int32: boolean;
    int64: boolean;
    document: boolean;
    string: boolean;
    decimal128: boolean;
    dbpointer: boolean;
    timestamp: boolean;
    dateTime: boolean;
    symbol: boolean;
    regularExpression: boolean;
    javaScript: boolean;
    javaScriptWithScope: boolean;
    objectId: boolean;
}

export interface Metadata {
    _contentType: string;
}

export interface ObjectId {
    timestamp: number;
    date: number;
}

export interface GridFSFile {
    id: Id;
    filename: string;
    length: number;
    chunkSize: number;
    uploadDate: number;
    metadata: Metadata;
    objectId: ObjectId;
}

export interface Stream {
    gridFSFile: GridFSFile;
}

export interface FileDB {
    title: string;
    stream: Stream;
}

