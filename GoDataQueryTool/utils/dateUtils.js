
const parseToDate = (date) => {
    return new Date(date).toISOString();
}

const isValidDate = (dateStr) => {
    return !isNaN(Date.parse(dateStr));
}

module.exports = {
    parseToDate, 
    isValidDate
}