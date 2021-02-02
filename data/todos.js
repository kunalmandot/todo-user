const todos = [
    {
        id: 1,
        userName: 'kunal',
        heading: 'Requirement Gathering',
        body: 'Understand requirements and do analysis'
        // user may have multiple things to do in a single todo. 
        /* body: [
            'Understand requirements',
            'Do analysis'
        ]*/
    },
    {
        id: 2,
        userName: 'kunal',
        heading: 'Create User Model',
        body: 'Create user table and define relationship with other tables',
        /* body: [
            'Create actual table',
            'Define relationship with other table'
        ]*/
    },
    {
        id: 3,
        userName: 'nil',
        heading: 'Perform Authentication',
        body: 'Develop signup, login and logout functionality'
        /* body: [
            'Develop signup feat',
            'Develop login feat',
            'Develop logout feat'
        ]*/
    },
    {
        id: 4,
        userName: 'sunil',
        heading: 'Perform Testing',
        body: 'Create and run test cases'
        /* body: [
            'Create test cases',
            'Run test cases'
        ]*/
    }
];

module.exports = todos;