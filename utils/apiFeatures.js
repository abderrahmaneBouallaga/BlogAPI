class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {...this.queryString}

        // delete some field from the query
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(e => delete queryObj[e])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }
    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy)
            this.query = this.query.sort(sortBy);
        } else {
            thos.query = this.query.sort('author')
        }
        return this;
    }
}

module.exports = APIFeatures;