# نظام العرض الرقمي لجامع سعيد رداد

نظام عرض رقمي يستخدم Google Sheets كلوحة تحكم لإدارة المحتوى المعروض.

## المميزات

- عرض المحتوى (صور وروابط) بشكل متناوب
- لوحة تحكم سهلة الاستخدام
- تكامل مع Google Sheets
- تحديثات مباشرة للمحتوى
- واجهة مستخدم عربية

## المتطلبات

- Node.js (v18 أو أحدث)
- حساب Google Cloud مع Google Sheets API مفعل

## التثبيت

1. استنسخ المشروع:
```bash
git clone https://github.com/albarqi19/s7.git
cd s7
```

2. ثبت الاعتماديات:
```bash
npm install
```

3. أنشئ ملف `.env` وأضف المتغيرات المطلوبة:
```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
```

4. شغل التطبيق:
```bash
npm run dev
```

## الاستخدام

- افتح لوحة التحكم: `http://localhost:5173/admin`
- افتح شاشة العرض: `http://localhost:5173`

## النشر

التطبيق جاهز للنشر على Vercel. تأكد من إضافة المتغيرات البيئية في إعدادات Vercel.

## التطوير

تم تطوير هذا النظام بواسطة أحمد البارقي لجامع سعيد رداد.
