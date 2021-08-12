const DefaultSort = {
    NEWEST: 'Newest',
    OLDEST: 'Oldest'
}

const UserSort = {
    ...DefaultSort,
    NAME: 'Name',
    LAST_ACTIVE: 'Last Active'
}

const CategorySort = {
    ...DefaultSort,
    NAME: 'Name'
}

const ProductSort = {
    ...DefaultSort,
    NAME: 'Name',
    LOW_TO_HIGH: 'Lowest to Highest',
    HIGH_TO_LOW: 'Highest to Lowest'
}

module.exports = {
    DefaultSort,
    UserSort,
    CategorySort,
    ProductSort
}