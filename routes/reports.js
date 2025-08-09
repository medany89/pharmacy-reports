// routes/reports.js
const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/database');

// الصفحة الرئيسية للتقارير
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        
        // جلب الصيدليات المتفوقة
        const topPerformingResult = await pool.request()
            .query('SELECT * FROM v_TopPerformingPharmacies ORDER BY achievement_percentage DESC');
        
        // جلب أداء جميع الصيدليات
        const allPharmaciesResult = await pool.request()
            .query('SELECT * FROM v_AllPharmaciesPerformance ORDER BY actual_income DESC');
        
        // جلب أفضل 3 صيدليات
        const top3Result = await pool.request()
            .query('SELECT * FROM v_Top3Pharmacies');

        res.render('index', {
            title: 'تقارير الصيدلية',
            topPerforming: topPerformingResult.recordset,
            allPharmacies: allPharmaciesResult.recordset,
            top3: top3Result.recordset
        });
    } catch (error) {
        console.error('خطأ في جلب التقارير:', error);
        res.status(500).render('error', { 
            title: 'خطأ في الخادم',
            message: 'خطأ في جلب البيانات',
            error: error 
        });
    }
});

// // API للحصول على تقرير محدد
// router.get('/api/:reportType', async (req, res) => {
//     try {
//         const pool = await getConnection();
//         const reportType = req.params.reportType;
//         let query = '';
        
//         switch (reportType) {
//             case 'top-performing':
//                 query = 'SELECT * FROM v_TopPerformingPharmacies ORDER BY achievement_percentage DESC';
//                 break;
//             case 'all-pharmacies':
//                 query = 'SELECT * FROM v_AllPharmaciesPerformance ORDER BY actual_income DESC';
//                 break;
//             case 'top3':
//                 query = 'SELECT * FROM v_Top3Pharmacies';
//                 break;
//             default:
//                 return res.status(400).json({ error: 'نوع التقرير غير صحيح' });
//         }
        
//         const result = await pool.request().query(query);
//         res.json(result.recordset);
//     } catch (error) {
//         console.error('خطأ في API:', error);
//         res.status(500).json({ error: 'خطأ في الخادم' });
//     }
// });

module.exports = router;



