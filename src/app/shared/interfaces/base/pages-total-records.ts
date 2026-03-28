export interface List<T = unknown> {
    data?: T;
    query: any;
    page: number;// em qual pagina estou: estou na segunda pagina: 2
    pageSize: number;// total de registro por pagina: 10 itens
    pages: number;// numero de paginas: 1 | 2 | 3
    totalRecords: number;// total de registro de todas as paginas: 30 itens
}