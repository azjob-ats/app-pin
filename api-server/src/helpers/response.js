function success(data, statusCode = 200, message = 'OK') {
  return {
    success: true,
    message,
    statusCode,
    data,
    timestamp: new Date().toISOString(),
  };
}

function failure(message = 'Error', statusCode = 500, code = 'unknown', type = 'genericError') {
  return {
    success: false,
    message,
    statusCode,
    errors: { code, message, type },
    timestamp: new Date().toISOString(),
  };
}

function paginated(items, page, pageSize, totalRecords, query = {}) {
  return {
    data: items,
    query,
    page,
    pageSize,
    pages: Math.ceil(totalRecords / pageSize),
    totalRecords,
  };
}

module.exports = { success, failure, paginated };
