const sql = require('mssql');
// إعدادات الاتصال بقاعدة البيانات


const config = {
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'your_database_name',
    // user: 'db24838',                    // أو اسم المستخدم الخاص بك
    // password: 'sF?8C9j+y#4H',     // كلمة مرور SQL Server
    // server: 'db24838.public.databaseasp.net',           // أو IP الخادم
    // database: 'db24838',       // اسم قاعدة البيانات
    options: {
        encrypt: process.env.NODE_ENV === 'production', // true للإنتاج
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
            console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        }
        return poolPromise;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
        
        // في حالة فشل الاتصال، اظهر رسالة واضحة
        if (error.code === 'ELOGIN') {
            console.error('تحقق من اسم المستخدم وكلمة المرور');
        } else if (error.code === 'ESOCKET') {
            console.error('تحقق من عنوان الخادم والشبكة');
        }
        
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