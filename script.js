// تتبع حركة الفأرة وتحديث المؤشر المخصص
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

// إضافة تأثير التكبير عند الوقوف فوق عناصر قابلة للتفاعل والضغط
const interactiveElements = document.querySelectorAll('.law-header, button, a');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
    });
});

// دالة فتح وإغلاق شريط القانون بسلاسة للأسفل
function toggleLaw(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    
    document.querySelectorAll('.law-item').forEach(el => {
        if (el !== item) {
            el.classList.remove('active');
            el.querySelector('.law-content').style.maxHeight = null;
        }
    });

    item.classList.toggle('active');
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        stopSpeech(); 
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// تقنية القراءة الصوتية باللغة العربية (Web Speech API) مع حل مشكلة الحظر
let synth = window.speechSynthesis;
let currentUtterance = null;

function speakText(button) {
    // 1. إنهاء أي نطق مسبق
    stopSpeech(); 

    // 2. جلب النص المراد قراءته
    const lawItem = button.closest('.law-content-inner');
    const textToRead = lawItem.querySelector('.law-text').innerText;

    // 3. إعداد النطق واللغة
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = 'ar-SA'; 
    currentUtterance.rate = 0.85; 

    // 4. حل مشكلة الأمان: تفعيل الصوت عبر استدعاء مباشر ومقبول من المتصفح
    if (synth.speaking) {
        synth.cancel();
    }
    
    // تشغيل محرك الصوت
    setTimeout(() => {
        synth.speak(currentUtterance);
    }, 50);
}

function stopSpeech() {
    if (synth && synth.speaking) {
        synth.cancel();
    }
}

// تهيئة محرك الصوت فور تحميل الصفحة لكسب ثقة المتصفح
window.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }
});
