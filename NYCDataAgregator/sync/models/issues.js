module.exports = (types, sequelize) =>
    sequelize.define(
        'issues', {
            id: {
                type: types.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            SUMMONS_NUMBER: {
                type: types.INTEGER,
                allowNull: false,
                unique: true
            },
            PLATE_ID: {
                type: types.STRING,
                allowNull: true
            },
            REGISTRATION_STATE: {
                type: types.STRING,
                allowNull: true
            },
            PLATE_TYPE: {
                type: types.STRING,
                allowNull: true
            },
            ISSUE_DATE: {
                type: types.DATE,
                allowNull: true
            },
            VIOLATION_CODE: {
                type: types.INTEGER,
                allowNull: true
            },
            VEHICLE_BODY_TYPE: {
                type: types.STRING,
                allowNull: true
            },
            VEHICLE_MAKE: {
                type: types.STRING,
                allowNull: true
            },
            ISSUING_AGENCY: {
                type: types.STRING,
                allowNull: true
            },
            STREET_CODE1: {
                type: types.INTEGER,
                allowNull: true
            },
            STREET_CODE2: {
                type: types.INTEGER,
                allowNull: true
            },
            STREET_CODE3: {
                type: types.INTEGER,
                allowNull: true
            },
            VEHICLE_EXPIRATION_DATE: {
                type: types.INTEGER,
                allowNull: true
            },
            VIOLATION_LOCATION: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_PRECINCT: {
                type: types.INTEGER,
                allowNull: true
            },
            ISSUER_PRECINCT: {
                type: types.INTEGER,
                allowNull: true
            },
            ISSUER_CODE: {
                type: types.INTEGER,
                allowNull: true
            },
            ISSUER_COMMAND: {
                type: types.STRING,
                allowNull: true
            },
            ISSUER_SQUAD: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_TIME: {
                type: types.STRING,
                allowNull: true
            },
            TIME_FIRST_OBSERVED: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_COUNTY: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_FRONT_OF_OPPOSITE: {
                type: types.STRING,
                allowNull: true
            },
            HOUSE_NUMBER: {
                type: types.STRING,
                allowNull: true
            },
            STREET_NAME: {
                type: types.STRING,
                allowNull: true
            },
            INTERSECTING_STREET: {
                type: types.STRING,
                allowNull: true
            },
            DATE_FIRST_OBSERVED: {
                type: types.INTEGER,
                allowNull: true
            },
            LAW_SECTION: {
                type: types.INTEGER,
                allowNull: true
            },
            SUB_DIVISION: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_LEGAL_CODE: {
                type: types.STRING,
                allowNull: true
            },
            DAYS_IN_EFFECT: {
                type: types.STRING,
                allowNull: true
            },
            FROM_HOURS_IN_EFFECT: {
                type: types.STRING,
                allowNull: true
            },
            TO_HOURS_IN_EFFECT: {
                type: types.STRING,
                allowNull: true
            },
            VEHICLE_COLOR: {
                type: types.STRING,
                allowNull: true
            },
            UNREGISTERED_VEHICLE: {
                type: types.STRING,
                allowNull: true
            },
            VEHICLE_YEAR: {
                type: types.INTEGER,
                allowNull: true
            },
            METER_NUMBER: {
                type: types.STRING,
                allowNull: true
            },
            FEET_FROM: {
                type: types.INTEGER,
                allowNull: true
            },
            VIOLATION_POST_CODE: {
                type: types.STRING,
                allowNull: true
            },
            VIOLATION_DESCRIPTION: {
                type: types.STRING,
                allowNull: true
            },
            NO_STANDING_OR_STOPPING_VIOLATION: {
                type: types.STRING,
                allowNull: true
            },
            HYDRANT_VIOLATION: {
                type: types.STRING,
                allowNull: true
            },
            DOUBLE_PARKING_VIOLATION: {
                type: types.STRING,
                allowNull: true
            }
        }, 
        {
            timestamps: true,
        },
    )