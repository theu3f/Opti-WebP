<div dir="rtl">

<p align="center">
  <img src="./optiwebp-github-banner.jpg" alt="بنر OptiWebP — ابزار بهینه‌سازی تصاویر تحت وب" width="100%">
</p>

<p align="center">
  <strong>ابزار فوق‌سریع، کاملاً سمت کاربر (کلاینت‌ساید) و خصوصی برای تبدیل و فشرده‌سازی تصاویر به فرمت WebP.</strong>
</p>

<p align="center">
  <a href="https://webp.pxlab.ir/"><img src="https://img.shields.io/badge/مشاهده_آنلاین-webp.pxlab.ir-0071e3?style=flat-square&logo=google-chrome&logoColor=white" alt="نسخه آنلاین"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/مجوز-MIT-blue.svg?style=flat-square" alt="مجوز MIT"></a>
  <img src="https://img.shields.io/badge/حریم_خصوصی-۱۰۰٪_سمت_کاربر-brightgreen.svg?style=flat-square" alt="۱۰۰٪ کلاینت‌ساید">
  <img src="https://img.shields.io/badge/ردگیری-صفر-blueviolet.svg?style=flat-square" alt="بدون ردیابی">
</p>

<p align="center">
  🚀 <strong>اجرای آنلاین و تست زنده: <a href="https://webp.pxlab.ir/">https://webp.pxlab.ir</a></strong>
</p>

<p align="center">
  🌐 <strong><a href="README.md">English</a></strong> • <strong><a href="README.fa.md">فارسی</a></strong>
</p>

---

## ⚡ درباره پروژه

**OptiWebP** یک استودیوی مدرن و با کارایی بالا تحت وب است که به شما امکان می‌دهد تصاویر مختلف (PNG، JPG، GIF، WebP) را به صورت مستقیم درون مرورگر خود به فرمت بهینه و کم‌حجم **WebP** تبدیل و فشرده کنید.

این برنامه با بهره‌گیری از سبک طراحی لوکس **Liquid Glassmorphism** (طراحی شیشه‌ای مایع الهام‌گرفته از اپل) ساخته شده است. این ابزار **بدون نیاز به سرور**، با حفظ ۱۰۰٪ حریم خصوصی فایل‌های کاربر و با بهره‌گیری از شتاب‌دهنده سخت‌افزاری مرورگر (Canvas / GPU)، تصاویر را با سرعتی خارق‌العاده بهینه‌سازی می‌کند.

---

## ✨ ویژگی‌های برجسته

- 🔒 **۱۰۰٪ سمت کاربر و فوق‌العاده امن**: فایل‌های شما هرگز در هیچ سرور یا ابری آپلود نمی‌شوند؛ تمام مراحل پردازش مستقیماً در حافظه دستگاه شما صورت می‌پذیرد.
- ⚡ **پردازش لحظه‌ای با شتاب سخت‌افزاری**: تبدیل همزمان چند تصویر با استفاده از موتور Canvas مرورگر بدون ایجاد وقفه.
- 💰 **بدون هزینه نگهداری و سرور**: ساختار کاملاً استاتیک؛ قابل استقرار رایگان روی **Cloudflare Pages**، **GitHub Pages** یا استفاده آفلاین.
- 🗂️ **پردازش گروهی با کشیدن و رها کردن (Drag & Drop)**: امکان افزودن ده‌ها عکس به طور همزمان و مدیریت جداگانه هر تصویر در صف تبدیل.
- 🎛️ **تنظیمات دقیق و پیشرفته**:
  - اسلایدر انتخاب سطح کیفیت از ۱۰٪ تا ۱۰۰٪
  - امکان فعال‌سازی حالت بدون افت کیفیت (**Lossless**)
  - تغییر ابعاد (عرض و ارتفاع) با قفل هوشمند نسبت تصویر (Aspect Ratio)
- 🔄 **بازرمزگذاری زنده (Live Re-encoding)**: اعمال تغییرات جدید روی تمامی تصاویر موجود در صف با یک کلیک.
- 📦 **خروجی آرشیو ZIP در لحظه**: فشرده‌سازی و بسته‌بندی فایل‌های خروجی در قالب یک فایل `.zip` مستقیماً درون حافظه مرورگر بدون نیاز به کتابخانه‌های سنگین جانبی.
- 💎 **رابط کاربری چشم‌نواز Liquid Glass**: تم تاریک اختصاصی با گوی‌های نوری پویا، انعکاس‌های شیشه‌ای و کنترل‌های مدرن.

---

## 🚀 راهنمای استقرار (Deploy)

### روش پیشنهادی: استقرار روی Cloudflare Pages

#### گزینه ۱: اتصال مستقیم به گیت‌هاب (CI/CD خودکار)
1. این مخزن را در حساب گیت‌هاب خود Fork یا Push کنید.
2. در داشبورد [Cloudflare](https://dash.cloudflare.com/)، به بخش **Workers & Pages** $\leftarrow$ **Create Application** $\leftarrow$ **Pages** $\leftarrow$ **Connect to Git** بروید.
3. مخزن `Opti-WebP` را انتخاب کنید.
4. تنظیمات ساخت را مشخص کنید:
   - **Framework preset**: مقدار `None`
   - **Build command**: *(خالی بگذارید)*
   - **Build output directory**: مقدار `public`
5. دکمه **Save and Deploy** را بزنید. وب‌سایت شما بلافاصله با آدرس اختصاصی، SSL رایگان و CDN جهانی در دسترس خواهد بود!

#### گزینه ۲: آپلود دستی (Drag & Drop)
1. در داشبورد کلودفلر، وارد مسیر **Workers & Pages** $\leftarrow$ **Create Application** $\leftarrow$ **Pages** $\leftarrow$ **Upload assets** شوید.
2. یک نام برای پروژه انتخاب کرده و پوشه `public` را داخل مرورگر بکشید و رها کنید.
3. روی **Deploy Site** کلیک کنید.

---

### استقرار روی GitHub Pages
1. وارد بخش **Settings** $\leftarrow$ **Pages** در مخزن گیت‌هاب خود شوید.
2. در بخش **Build and deployment**، گزینه **Source** را روی **Deploy from a branch** قرار دهید.
3. شاخه `master` (یا شاخه اصلی) را انتخاب کرده و از طریق اکشن‌ها یا تنظیمات، پوشه `public` را منتشر نمایید.

---

## 💻 راه‌اندازی و اجرای محلی

این پروژه برای اجرا به هیچ ابزار پیچیده یا بیلد اسکریپت سنگینی نیاز ندارد:

1. ابتدا مخزن را کلون کنید:
   ```bash
   git clone https://github.com/theu3f/Opti-WebP.git
   cd Opti-WebP
   ```

2. سرور سبک توسعه را اجرا کنید:
   ```bash
   npm start
   ```

3. در مرورگر به این آدرس بروید:
   👉 **[http://localhost:3333](http://localhost:3333)**

*(همچنین می‌توانید فایل `public/index.html` را مستقیماً با دو بار کلیک باز کنید تا بدون هیچ سروری و به صورت کاملاً آفلاین کار کند!)*

---

## 🛠️ فناوری‌های مورد استفاده

- **فرانت‌اند**: Vanilla JavaScript (ES6+), HTML5, CSS3 Custom Properties
- **هسته فشرده‌سازی**: HTML5 Canvas API, FileReader, Blob
- **تولید آرشیو زیپ**: Pure JS In-Memory ZIP Encoder بدون وابستگی خارجی
- **سرور تست محلی**: ماژول داخلی HTTP در Node.js (`dev.js`)

---

## 📄 مجوز و حق نشر

این پروژه تحت [مجوز MIT](LICENSE) منتشر شده است.  
توسعه داده شده با ❤️ توسط **[U3F](https://github.com/theu3f)** &bull; **PXLab**.

</div>
