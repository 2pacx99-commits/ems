// تصدير Excel باستخدام SheetJS
function exportExcel() {
    let table = document.querySelector('.modern-table');
    let wb = XLSX.utils.table_to_book(table, {sheet:"البيانات"});
    XLSX.writeFile(wb, "EMS_High_Command_Report.xlsx");
    Toast.fire({ icon: 'success', title: 'تم التصدير بنجاح' });
}

// بحث مباشر في الجدول
document.getElementById('liveSearch').addEventListener('keyup', function() {
    let filter = this.value.toUpperCase();
    let rows = document.getElementById('membersTableBody').getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        let textValue = rows[i].textContent || rows[i].innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
});