export const paginationHelper = (paginationObject: {limit ?: number, page ?: number}, countRecord: number): any => {
    const result = {};
    result['limit'] = paginationObject.limit || 10;
    result['currentPage'] = paginationObject.page || 1;
    result['total'] = Math.floor(countRecord/result['limit']);
    result['prevPage'] = result['currentPage'] > 1 ? result['currentPage'] - 1 : null;
    result['nextPage'] = result['currentPage'] < result['total'] ? result['currentPage'] + 1: null;
    result['skip'] = (result['currentPage'] - 1) *  result['limit'];
    return result;
}