// وظائف الصفحة الرئيسية

// تحديث التقارير
function refreshReports() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // إظهار مؤشر التحميل
    button.innerHTML = '<span class="loading-spinner me-2"></span>جاري التحديث...';
    button.disabled = true;
    
    // إعادة تحميل الصفحة بعد ثانية واحدة
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// تنسيق الأرقام عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات التحريك للكروت
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
    
    // تحسين عرض الجداول
    makeTablesResponsive();
    
    // إضافة مؤشرات الأداء
    addPerformanceIndicators();
});

// جعل الجداول متجاوبة
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // إضافة خاصية التمرير الأفقي للجداول الكبيرة
        if (table.offsetWidth > table.parentElement.offsetWidth) {
            table.parentElement.style.overflowX = 'auto';
        }
    });
}

// إضافة مؤشرات الأداء
function addPerformanceIndicators() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = parseFloat(bar.style.width);
        
        // إضافة رمز الأداء
        if (width >= 100) {
            bar.innerHTML += ' ✓';
            bar.classList.add('bg-success');
        } else if (width >= 75) {
            bar.innerHTML += ' ⚠';
            bar.classList.add('bg-warning');
        } else {
            bar.innerHTML += ' ⚠';
            bar.classList.add('bg-danger');
        }
    });
}

// وظيفة لتصدير البيانات إلى Excel (اختيارية)
function exportToExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [];
        const cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            let cellText = cols[j].innerText;
            // تنظيف النص من الأيقونات والرموز الخاصة
            cellText = cellText.replace(/[✓⚠]/g, '').trim();
            row.push(cellText);
        }
        csv.push(row.join(','));
    }
    
    // إنشاء ملف CSV وتنزيله
    const csvContent = csv.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// وظيفة لطباعة التقرير
function printReport() {
    window.print();
}

// وظيفة للبحث في الجداول
function searchTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    const filter = input.value.toUpperCase();
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}

// إظهار تفاصيل إضافية للصيدلية
function showPharmacyDetails(pharmacyId) {
    // يمكن إضافة modal أو صفحة منفصلة لعرض تفاصيل أكثر
    console.log('عرض تفاصيل الصيدلية:', pharmacyId);
}

// تحديث البيانات كل 5 دقائق (اختياري)
function startAutoRefresh() {
    setInterval(() => {
        // تحديث البيانات في الخلفية
        fetch('/reports/api/all-pharmacies')
            .then(response => response.json())
            .then(data => {
                // تحديث الجدول بدون إعادة تحميل الصفحة
                updateTableData('allPharmaciesTable', data);
            })
            .catch(error => {
                console.error('خطأ في تحديث البيانات:', error);
            });
    }, 300000); // 5 دقائق
}

// تحديث بيانات الجدول
function updateTableData(tableId, data) {
    const table = document.getElementById(tableId);
    if (!table || !data) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // مسح البيانات القديمة
    tbody.innerHTML = '';
    
    // إضافة البيانات الجديدة
    data.forEach(item => {
        const row = document.createElement('tr');
        // إنشاء خلايا الجدول بناءً على البيانات
        // هذا مثال بسيط، يمكن تخصيصه حسب نوع البيانات
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
}