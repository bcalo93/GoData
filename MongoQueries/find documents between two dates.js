db.getCollection('issuescodes').find(
    {
        violationCode: "X6", 
        "issues.date": {
            $gte: ISODate("2020-06-23T00:00:00.000Z"),
            $lte: ISODate("2020-06-23T00:00:00.000Z")
        }
    })

