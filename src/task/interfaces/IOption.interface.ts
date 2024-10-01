export interface IOption {
    keyword ?: string;

    sortBy ?: 'title' | 'time_start' | 'time_finish' | 'createdAt';

    order ?: 'ASC' | 'DESC';

    page ?: number;

    limit ?: number;

    idUser ?: number;
}