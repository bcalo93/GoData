const { FilterType } = require('./../dependencies/Commons');
const { ValidationRegistryException } = require('../exceptions');
const filterValidations = require('./filtervalidations');

const DEFAULT_FILTERS = [{ name: FilterType.JSON_FORMAT }];
const URL_REG = /^(http|https):\/\/([a-zA-Z0-9.]+)(:([0-9]+))?((\/([\w]+))+)?(\/{1})?(\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?)?$/;
const VALID_METHODS = ['post', 'put', 'patch'];
const FORMAT_FILTERS = [FilterType.XML_FORMAT, FilterType.JSON_FORMAT];
const VALID_FILTERS = Object.values(FilterType);

module.exports = class Registry {
    constructor({ id, endpoint, method, filters }) {
        this.id = id;
        this.endpoint = endpoint;
        this.method = method ? method.toLowerCase() : VALID_METHODS[0];
        this.filters = filters || DEFAULT_FILTERS;
        this.errors = [];
    }

    validate() {
        this.validateId();
        this.validateEndpoint();
        this.validateMethod();
        this.validateFilters();
        if (this.errors.length > 0) {
            throw new ValidationRegistryException(
                'Registry is not valid', { errors: this.errors }
            );
        }
        return this;
    }

    validateId() {
        if (!this.id) {
            this.errors.push('id is missing');
        }
    }

    validateEndpoint() {
        if (!this.endpoint) {
            this.errors.push('endpoint is missing');
        
        } else if(!URL_REG.test(this.endpoint)) {
            this.errors.push('endpoint is not a valid url');

        }
    }
    
    validateMethod() {
        if(!VALID_METHODS.some(value => value === this.method)) {
            this.errors.push(`method "${this.method}" is not valid`);
        }
    }

    validateFilters() {
        const valuesSoFar = new Set();
        this.filters.forEach(value => {
            if (!value.name) {
                this.errors.push('All filters should have a name property');
                return;
            }

            if (!VALID_FILTERS.some(filter => filter === value.name)) {
                this.errors.push(`"${value.name}" is not a valid filter`);
            }

            if (valuesSoFar.has(value.name)) {
                this.errors.push(`${value.name} is duplicated`);
            
            } else {
                valuesSoFar.add(value.name);
                const validation = filterValidations[value.name];
                if (validation) {
                    this.errors.push(...validation(value));
                }
            }
        });

        const lastFilter = this.filters[this.filters.length - 1];
        if (!FORMAT_FILTERS.some(element => lastFilter.name === element)) {
            this.errors.push('Last filter must be a format filter');
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