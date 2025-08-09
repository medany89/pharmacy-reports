


// config/database.js
const sql = require('mssql');

const config = {
    user: 'userName',                    // أو اسم المستخدم الخاص بك
    password: 'password',     // كلمة مرور SQL Server
    server: 'server',           // أو IP الخادم
    database: 'DbName',       // اسم قاعدة البيانات
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 60000,
    requestTimeout: 60000
};

let poolPromise = null;

const getConnection = async () => {
    try {
        if (!poolPromise) {
            poolPromise = new sql.ConnectionPool(config);
            await poolPromise.connect();
            console.log('تم الاتصال بقاعدة البيانات بنجاح');
        }
        return poolPromise;
    } catch (error) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', error);
        throw error;
    }
};

// إغلاق الاتصال عند إنهاء التطبيق
process.on('SIGINT', async () => {
    try {
        if (poolPromise) {
            await poolPromise.close();
            console.log('تم إغلاق اتصال قاعدة البيانات');
        }
        process.exit(0);
    } catch (error) {
        console.error('خطأ في إغلاق الاتصال:', error);
        process.exit(1);
    }
});

module.exports = {
    sql,
    getConnection
};