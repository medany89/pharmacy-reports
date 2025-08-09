// require('dotenv').config();
// const express = require('express');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // إعداد محرك القوالب EJS
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // إعداد الملفات الثابتة
// app.use(express.static(path.join(__dirname, 'public')));

// // إعداد معالج JSON و URL encoded
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // التحقق من وجود ملف التوجيه قبل استيراده
// let reportsRouter;
// try {
//     reportsRouter = require('./routes/reports');
//     console.log('تم تحميل ملف التوجيهات بنجاح');
// } catch (error) {
//     console.error('خطأ في تحميل ملف التوجيهات:', error.message);
    
//     // إنشاء router مؤقت في حالة عدم وجود الملف
//     reportsRouter = express.Router();
//     reportsRouter.get('/', (req, res) => {
//         res.render('error', {
//             title: 'خطأ في التكوين',
//             message: 'ملف التوجيهات غير موجود. تأكد من إنشاء مجلد routes وملف reports.js',
//             error: { message: 'Module not found: ./routes/reports' }
//         });
//     });
// }

// // استخدام مسارات التقارير
// app.use('/reports', reportsRouter);

// // الصفحة الرئيسية
// app.get('/', (req, res) => {
//     res.redirect('/reports');
// });

// // تجربة اتصال بسيط لاختبار قاعدة البيانات
// app.get('/test-db', async (req, res) => {
//     try {
//         const { getConnection } = require('./config/database');
//         const pool = await getConnection();
//         res.json({ 
//             status: 'success', 
//             message: 'تم الاتصال بقاعدة البيانات بنجاح',
//             time: new Date().toLocaleString('ar-EG')
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             status: 'error', 
//             message: 'فشل الاتصال بقاعدة البيانات',
//             error: error.message 
//         });
//     }
// });

// // معالج الأخطاء 404
// app.use((req, res) => {
//     res.status(404).render('error', {
//         title: 'الصفحة غير موجودة',
//         message: 'الصفحة التي تبحث عنها غير موجودة',
//         error: { status: 404, message: 'Page not found' }
//     });
// });

// // معالج الأخطاء العام
// app.use((err, req, res, next) => {
//     console.error('خطأ عام:', err);
//     res.status(500).render('error', {
//         title: 'خطأ في الخادم',
//         message: 'حدث خطأ في الخادم',
//         error: err
//     });
// });

// // بدء الخادم
// app.listen(PORT, () => {
//     console.log('=================================');
//     console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
//     console.log(`🌐 افتح المتصفح على: http://localhost:${PORT}`);
//     console.log(`🧪 اختبار قاعدة البيانات: http://localhost:${PORT}/test-db`);
//     console.log('=================================');
// });

// module.exports = app;







// تحميل متغيرات البيئة
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 بدء تشغيل خادم تقارير الصيدلية...');
console.log(`📊 البيئة: ${process.env.NODE_ENV || 'development'}`);

// إعداد محرك القوالب EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// إعداد الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// إعداد معالج JSON و URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// التحقق من وجود ملف التوجيه قبل استيراده
let reportsRouter;
try {
    reportsRouter = require('./routes/reports');
    console.log('✅ تم تحميل ملف التوجيهات بنجاح');
} catch (error) {
    console.error('❌ خطأ في تحميل ملف التوجيهات:', error.message);
    
    // إنشاء router مؤقت في حالة عدم وجود الملف
    reportsRouter = express.Router();
    reportsRouter.get('/', (req, res) => {
        res.render('error', {
            title: 'خطأ في التكوين',
            message: 'ملف التوجيهات غير موجود. تأكد من إنشاء مجلد routes وملف reports.js',
            error: { message: 'Module not found: ./routes/reports' }
        });
    });
}

// استخدام مسارات التقارير
app.use('/reports', reportsRouter);

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.redirect('/reports');
});

// صفحة معلومات النظام
app.get('/info', (req, res) => {
    res.json({
        name: 'نظام تقارير الصيدلية',
        version: '1.0.0',
        status: 'يعمل بنجاح',
        environment: process.env.NODE_ENV || 'development',
        time: new Date().toLocaleString('ar-EG'),
        features: [
            'تقارير الأداء المالي',
            'أفضل الصيدليات',
            'إحصائيات شاملة'
        ]
    });
});

// تجربة اتصال بسيط لاختبار قاعدة البيانات
app.get('/test-db', async (req, res) => {
    try {
        const { getConnection } = require('./config/database');
        const pool = await getConnection();
        
        // اختبار استعلام بسيط
        const result = await pool.request().query('SELECT 1 AS test');
        
        res.json({ 
            status: 'success', 
            message: 'تم الاتصال بقاعدة البيانات بنجاح ✅',
            time: new Date().toLocaleString('ar-EG'),
            testQuery: result.recordset
        });
    } catch (error) {
        console.error('خطأ في اختبار قاعدة البيانات:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'فشل الاتصال بقاعدة البيانات ❌',
            error: error.message,
            suggestions: [
                'تحقق من بيانات الاتصال في .env',
                'تأكد من تشغيل SQL Server',
                'تحقق من صحة اسم قاعدة البيانات'
            ]
        });
    }
});

// معالج الأخطاء 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'الصفحة غير موجودة',
        message: `الصفحة ${req.url} غير موجودة`,
        error: { status: 404, message: 'Page not found' }
    });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error('❌ خطأ عام في الخادم:', err);
    res.status(500).render('error', {
        title: 'خطأ في الخادم',
        message: 'حدث خطأ غير متوقع في الخادم',
        error: process.env.NODE_ENV === 'development' ? err : { message: 'Internal server error' }
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
    console.log(`🌐 الرابط المحلي: http://localhost:${PORT}`);
    console.log(`🧪 اختبار قاعدة البيانات: http://localhost:${PORT}/test-db`);
    console.log(`ℹ️  معلومات النظام: http://localhost:${PORT}/info`);
    console.log('=================================');
});

// معالجة إغلاق التطبيق بأمان
process.on('SIGTERM', () => {
    console.log('🛑 إشارة إنهاء - إغلاق الخادم...');
    process.exit(0);
});

module.exports = app;