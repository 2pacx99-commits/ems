const fs = require('fs');
const path = require('path');

// 1. إنشاء هيكل المجلدات الاحترافي
const directories = [
  'public', 'public/css', 'public/js', 'public/assets', 
  'public/assets/images', 'public/assets/icons', 'api'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 2. محتوى الملفات
const files = {
  // --- إعدادات Node.js والحزم ---
  'package.json': JSON.stringify({
    name: "ems-high-command",
    version: "1.0.0",
    scripts: {
      "start": "node api/server.js",
      "zip": "node zip-project.js"
    },
    dependencies: {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "archiver": "^6.0.1",
      "dotenv": "^16.3.1"
    }
  }, null, 2),

  // --- إعدادات Vercel ---
  'vercel.json': JSON.stringify({
    version: 2,
    builds: [{ src: "api/server.js", use: "@vercel/node" }],
    routes: [{ src: "/(.*)", dest: "api/server.js" }]
  }, null, 2),

  // --- ملف ضغط المشروع ---
  'zip-project.js': `
const fs = require('fs');
const archiver = require('archiver');
const output = fs.createWriteStream('EMS-Project.zip');
const archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', () => console.log('✅ تم إنشاء ملف EMS-Project.zip بنجاح، وهو جاهز للرفع على GitHub / Vercel.'));
archive.pipe(output);
archive.glob('**/*', { ignore: ['node_modules/**', 'setup.js', 'zip-project.js', 'EMS-Project.zip'] });
archive.finalize();
  `,

  // --- السيرفر الخلفي (Backend) ---
  'api/server.js': `
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// مسار افتراضي
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', system: 'EMS High Command', province: 'Toronto' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
module.exports = app;
  `,

  // --- الصفحة الرئيسية (Frontend) ---
  'public/index.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الهلال الأحمر | مقاطعة تورنتو - لوحة القيادة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/animations.css">
</head>
<body class="dark-neon-theme">

    <div class="paramedic-character-container">
        <div class="paramedic-avatar"></div>
        <div class="glow-platform"></div>
    </div>

    <header class="glass-header">
        <div class="header-right">
            <div class="logo-box">
                <i class="fa-solid fa-truck-medical neon-icon"></i>
                <div class="logo-text">
                    <h1>الهلال الأحمر</h1>
                    <span>مقاطعة تورنتو | نظام الإدارة</span>
                </div>
            </div>
            <div class="status-badge pulse-glow">
                <span class="dot online"></span> متصل
            </div>
        </div>
        <div class="header-left">
            <div class="time-update"><i class="fa-solid fa-clock"></i> آخر تحديث: <span id="lastUpdate">الآن</span></div>
            <button class="icon-btn"><i class="fa-solid fa-bell"></i><span class="notification-dot"></span></button>
            <button class="icon-btn" onclick="openModal('settingsModal')"><i class="fa-solid fa-gear"></i></button>
            <div class="user-profile">
                <img src="https://ui-avatars.com/api/?name=Admin&background=ff003c&color=fff" alt="User">
                <button class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        </div>
    </header>

    <div class="app-container">
        <aside class="glass-sidebar">
            <nav class="side-nav">
                <button class="nav-item active" data-target="dashboard"><i class="fa-solid fa-chart-pie"></i> الإحصائيات</button>
                <button class="nav-item" data-target="members"><i class="fa-solid fa-users"></i> الأعضاء</button>
                <button class="nav-item" data-target="ranks"><i class="fa-solid fa-star"></i> الرتب</button>
                <button class="nav-item" data-target="salaries"><i class="fa-solid fa-sack-dollar"></i> الرواتب</button>
                <button class="nav-item" data-target="warnings"><i class="fa-solid fa-triangle-exclamation"></i> الإنذارات</button>
                <button class="nav-item" data-target="medals"><i class="fa-solid fa-medal"></i> الأوسمة</button>
                <button class="nav-item" data-target="promotions"><i class="fa-solid fa-arrow-trend-up"></i> الترقيات</button>
                <button class="nav-item" data-target="discord"><i class="fa-brands fa-discord"></i> ديسكورد</button>
            </nav>
        </aside>

        <main class="main-content">
            
            <section id="dashboard" class="view-section active fade-in">
                <div class="stats-grid">
                    <div class="stat-card glass-panel" data-tooltip="إجمالي المسعفين في النظام">
                        <div class="stat-icon"><i class="fa-solid fa-users-medical"></i></div>
                        <div class="stat-data">
                            <h3>المسعفين</h3>
                            <h2 class="counter" data-target="154">0</h2>
                        </div>
                    </div>
                    <div class="stat-card glass-panel">
                        <div class="stat-icon online-icon"><i class="fa-solid fa-signal"></i></div>
                        <div class="stat-data">
                            <h3>المتصلين</h3>
                            <h2 class="counter" data-target="42">0</h2>
                        </div>
                    </div>
                    </div>

                <div class="table-container glass-panel mt-4">
                    <div class="table-header">
                        <h2><i class="fa-solid fa-list"></i> السجل الشامل</h2>
                        <div class="table-actions">
                            <div class="search-box">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <input type="text" id="liveSearch" placeholder="بحث مباشر...">
                            </div>
                            <button class="btn-neon" onclick="exportExcel()"><i class="fa-solid fa-file-excel"></i> تصدير</button>
                            <button class="btn-neon" onclick="document.getElementById('importExcel').click()"><i class="fa-solid fa-upload"></i> استيراد</button>
                            <input type="file" id="importExcel" hidden accept=".xlsx, .xls">
                            <button class="btn-primary" onclick="openModal('addMemberModal')"><i class="fa-solid fa-plus"></i> إضافة عضو</button>
                        </div>
                    </div>
                    
                    <div class="custom-scrollbar-wrapper">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="selectAll"></th>
                                    <th>الاسم</th>
                                    <th>الرتبة</th>
                                    <th>Discord ID</th>
                                    <th>الحالة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="membersTableBody">
                                <tr class="skeleton-row"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                <tr class="skeleton-row"><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <button class="btn-glass">السابق</button>
                        <span>صفحة 1 من 5</span>
                        <button class="btn-glass">التالي</button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div id="addMemberModal" class="modal-overlay">
        <div class="modal-content glass-panel scale-in">
            <div class="modal-header">
                <h2>إضافة مسعف جديد</h2>
                <button class="close-btn" onclick="closeModal('addMemberModal')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
                <div class="form-grid">
                    <div class="input-group">
                        <label>الاسم داخل اللعبة</label>
                        <input type="text" placeholder="مثال: John Doe">
                    </div>
                    <div class="input-group">
                        <label>Discord ID</label>
                        <input type="text" placeholder="أرقام فقط">
                    </div>
                    <div class="input-group">
                        <label>Steam Hex</label>
                        <input type="text" placeholder="steam:1100001...">
                    </div>
                    <div class="input-group">
                        <label>الرتبة</label>
                        <select>
                            <option>E-001 | متدرب</option>
                            <option>E-002 | مسعف</option>
                            <option>Golden Leadership</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-glass" onclick="closeModal('addMemberModal')">إلغاء</button>
                <button class="btn-primary" onclick="saveMember()"><i class="fa-solid fa-floppy-disk"></i> حفظ البيانات</button>
            </div>
        </div>
    </div>

    <footer class="system-footer glass-panel">
        <p>صنع بواسطة: <strong>أكرم نـجف</strong></p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/main.js"></script>
    <script src="js/table.js"></script>
</body>
</html>`,

  // --- ملف التنسيقات (CSS) الأساسي ---
  'public/css/style.css': `
:root {
    --primary-red: #ff003c;
    --primary-glow: rgba(255, 0, 60, 0.4);
    --bg-dark: #0a0a0d;
    --glass-bg: rgba(20, 20, 25, 0.65);
    --glass-border: rgba(255, 255, 255, 0.05);
    --text-main: #ffffff;
    --text-muted: #888899;
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif; }
body { background: var(--bg-dark); color: var(--text-main); overflow-x: hidden; }

/* تأثير Glassmorphism */
.glass-panel, .glass-header, .glass-sidebar {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Header */
.glass-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 30px; border-bottom: 1px solid var(--primary-glow);
    position: sticky; top: 0; z-index: 100;
}
.header-right { display: flex; align-items: center; gap: 20px; }
.logo-box { display: flex; align-items: center; gap: 15px; }
.neon-icon { font-size: 2rem; color: var(--primary-red); text-shadow: 0 0 15px var(--primary-red); }
.logo-text h1 { font-size: 1.2rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
.logo-text span { font-size: 0.8rem; color: var(--text-muted); }

/* Buttons */
.btn-primary {
    background: var(--primary-red); color: #fff; border: none;
    padding: 10px 20px; border-radius: 8px; cursor: pointer;
    font-weight: 700; transition: all 0.3s ease;
    box-shadow: 0 0 15px var(--primary-glow);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 25px var(--primary-glow); }

.btn-neon {
    background: transparent; border: 1px solid var(--primary-red);
    color: var(--primary-red); padding: 10px 20px; border-radius: 8px;
    cursor: pointer; font-weight: 700; transition: all 0.3s;
}
.btn-neon:hover { background: var(--primary-red); color: #fff; box-shadow: 0 0 15px var(--primary-red); }

/* الشخصية المتحركة (3D Paramedic Sticker) */
.paramedic-character-container {
    position: fixed; left: 30px; bottom: 80px; width: 220px; height: 320px;
    z-index: 50; pointer-events: none;
}
.paramedic-avatar {
    width: 100%; height: 100%;
    /* استبدل هذا الرابط بصورة الـ Sticker الخاصة بك */
    background: url('https://i.imgur.com/vHqJ8h0.png') no-repeat center bottom / contain;
    filter: drop-shadow(0 15px 25px rgba(255,0,60,0.5));
    animation: float 4s ease-in-out infinite, breathe 3s ease-in-out infinite;
}
.glow-platform {
    position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
    width: 150px; height: 15px; background: radial-gradient(ellipse, rgba(255,0,60,0.8), transparent);
    border-radius: 50%; filter: blur(8px); animation: pulseGlow 2s infinite;
}

/* Footer */
.system-footer {
    position: fixed; bottom: 0; width: 100%; text-align: center;
    padding: 10px; font-size: 0.9rem; border-top: 1px solid var(--glass-border);
    z-index: 100;
}
.system-footer strong { color: var(--primary-red); text-shadow: 0 0 5px var(--primary-glow); }
  `,

  // --- ملف التنسيقات (Dashboard) ---
  'public/css/dashboard.css': `
.app-container { display: flex; min-height: calc(100vh - 120px); }
.glass-sidebar { width: 250px; padding: 20px 0; border-left: 1px solid var(--glass-border); }
.side-nav { display: flex; flex-direction: column; gap: 5px; }
.nav-item {
    background: transparent; border: none; color: var(--text-muted);
    padding: 15px 20px; text-align: right; font-size: 1.05rem;
    cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 15px;
}
.nav-item:hover, .nav-item.active {
    background: rgba(255,0,60,0.1); color: #fff;
    border-right: 4px solid var(--primary-red);
}
.main-content { flex: 1; padding: 30px; overflow-y: auto; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.stat-card { padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 20px; transition: 0.3s; cursor: default; }
.stat-card:hover { transform: translateY(-5px); border-color: var(--primary-red); box-shadow: 0 0 20px var(--primary-glow); }
.stat-icon { font-size: 2.5rem; color: var(--primary-red); }

/* Table Styles */
.table-container { padding: 20px; border-radius: 12px; margin-bottom: 50px;}
.modern-table { width: 100%; border-collapse: collapse; text-align: right; }
.modern-table th { background: rgba(0,0,0,0.4); padding: 15px; border-bottom: 2px solid var(--primary-red); position: sticky; top: 0;}
.modern-table td { padding: 15px; border-bottom: 1px solid var(--glass-border); transition: 0.2s; }
.modern-table tr:hover td { background: rgba(255,0,60,0.05); }

/* Modals */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
    display: none; justify-content: center; align-items: center; z-index: 1000;
}
.modal-overlay.active { display: flex; }
.modal-content { width: 600px; padding: 25px; border-radius: 15px; border: 1px solid var(--primary-glow); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
.input-group label { display: block; margin-bottom: 8px; color: var(--text-muted); }
.input-group input, .input-group select {
    width: 100%; padding: 12px; background: rgba(0,0,0,0.5);
    border: 1px solid var(--glass-border); color: #fff; border-radius: 8px;
}
.input-group input:focus { border-color: var(--primary-red); outline: none; box-shadow: 0 0 10px var(--primary-glow); }
  `,

  // --- ملف الأنيميشن (Animations) ---
  'public/css/animations.css': `
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.2); } }
.fade-in { animation: fadeIn 0.5s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.scale-in { animation: scaleIn 0.3s ease-out forwards; }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `,

  // --- ملف الجافاسكريبت (Main App) ---
  'public/js/main.js': `
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
  `,

  // --- ملف الجافاسكريبت (الجدول والتصدير) ---
  'public/js/table.js': `
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
  `
};

// 3. كتابة الملفات
Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(path.join(__dirname, filepath), content.trim());
});

console.log('✅ تم الانتهاء! المشروع مصمم ومبني بالكامل من الصفر.');
console.log('🔹 الخطوة التالية: اكتب في الـ Terminal:');
console.log('   npm install');
console.log('🔹 لتشغيل المشروع محلياً: npm start');
console.log('🔹 لضغط المشروع وتجهيزه للرفع (Vercel/GitHub): npm run zip');