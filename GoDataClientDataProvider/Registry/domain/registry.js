const { FilterType } = require('./../dependencies/Commons');
const { ValidationRegistryException } = require('../exceptions');

const DEFAULT_METHOD = 'post';
const DEFAULT_FILTERS = [{ name: FilterType.JSON_FORMAT }];

module.exports = class Registry {
    constructor({ id, endpoint, method, filters }) {
        this.id = id;
        this.endpoint = endpoint;
        this.method = method || DEFAULT_METHOD;
        this.filters = filters || DEFAULT_FILTERS;
        this.errors = [];
    }

    validate() {
        this.reviewId();
        this.reviewEndpoint();
        if (this.errors.length > 0) {
            throw new ValidationRegistryException(
                'Registry is not valid', { errors: this.errors }
            );
        }
        return this;
    }

    reviewId() {
        if (!this.id) {
            this.errors.push('"id" is missing');
        }
    }

    reviewEndpoint() {
        if (!this.endpoint) {
            this.errors.push('"endpoint" is missing');
        }
    }

    getAsObject() {
        return {
            id: this.id,
            endpoint: this.endpoint,
            method: this.method,
            filters: this.filters
        };
    }
}