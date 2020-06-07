
const parseToDate = (date) => {
    return new Date(date).toISOString();
}

const isValidDate = (dateStr) => {
    return !isNaN(Date.parse(dateStr));
}

const getYearFromDate = (date) => {
    return new Date(date).getFullYear() || 0;
}

const getMonthFromDate = (date) => {
    return new Date(date).getMonth() || 0;
}

module.exports = {
    parseToDate, 
    isValidDate,
    getYearFromDate,
    getMonthFromDate
}