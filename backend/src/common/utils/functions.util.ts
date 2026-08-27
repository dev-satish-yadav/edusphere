export const sortFilterPagination = (
  currentPage: any,
  perPage: any,
  total_record: number,
  additionalSortData: any = null,
  sortBy: any = null,
  sortType: any = null,
) => {
  try {
    const per_page: any = perPage ? parseInt(perPage) : 20;
    const page: any = currentPage ? parseInt(currentPage) : 1;

    const total_pages = Math.ceil(total_record / per_page);
    const prev_enable = parseInt(page) - 1;
    const next_enable = total_pages <= page ? 0 : 1;
    const start_from: any = (page - 1) * per_page;

    const sort: any = {};
    let sortField = '_id';
    let sortOrder = -1;
    const sortData = {
      _id: '_id',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      createdBy: 'createdBy',
      updatedBy: 'updatedBy',
      ...additionalSortData, // Merge additional fields into the default sortData
    };

    //Sort data
    if (
      sortType !== undefined &&
      sortType !== null &&
      sortType !== '' &&
      sortData !== null &&
      Object.keys(sortData).includes(sortType)
    ) {
      sortField = sortData[sortType];
    }
    if (sortBy !== undefined && sortBy !== null && sortBy !== '' && (sortBy == -1 || sortBy == 1)) {
      sortOrder = parseInt(sortBy);
    }
    sort[sortField] = sortOrder;

    return {
      per_page,
      page,
      total_pages,
      prev_enable,
      next_enable,
      start_from,
      sort,
      sort_by: sortOrder,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};
