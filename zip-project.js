const fs = require('fs');
const archiver = require('archiver');
const output = fs.createWriteStream('EMS-Project.zip');
const archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', () => console.log('✅ تم إنشاء ملف EMS-Project.zip بنجاح، وهو جاهز للرفع على GitHub / Vercel.'));
archive.pipe(output);
archive.glob('**/*', { ignore: ['node_modules/**', 'setup.js', 'zip-project.js', 'EMS-Project.zip'] });
archive.finalize();