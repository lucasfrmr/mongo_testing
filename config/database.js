module.exports = {
    //changed for cloud 9
    // mongo ds019756.mlab.com:19756/kb -u <dbuser> -p <dbpassword>
    database:'mongodb://admin:mongo_testing@ds019756.mlab.com:19756/kb',
    // database:'mongodb://localhost:27017/mongo_testingkb',
    // database:'mongodb://'+process.env.IP+':27017/nodekb',
    secret: 'keyboard cat'
}
