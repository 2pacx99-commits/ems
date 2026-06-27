// إعدادات الواجهة والأنيميشن
document.addEventListener('DOMContentLoaded', () => {
    // تشغيل العدادات
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const c = +counter.innerText;
            const increment = target / 50;
            if (c < target) {
                counter.innerText = Math.ceil(c + increment);
                setTimeout(updateCounter, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });

    // التنقل بين القوائم (SPA Routing)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            // هنا يتم إضافة كود إخفاء/إظهار الأقسام (Sections)
        });
    });
});

// نظام النوافذ المنبثقة (Modals)
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// نظام الإشعارات (SweetAlert Toast)
const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false,
    timer: 3000, timerProgressBar: true, background: '#0a0a0d', color: '#fff'
});

function saveMember() {
    closeModal('addMemberModal');
    Toast.fire({
        icon: 'success',
        title: 'تم إضافة المسعف بنجاح',
        iconColor: '#ff003c'
    });
}