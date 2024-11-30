let display = document.getElementById('result');
let currentInput = '';
let isDarkMode = false;
let lastWasResult = false; // متغير جديد لتتبع ما إذا كان آخر إجراء هو حساب نتيجة

// الثوابت الرياضية
const CONSTANTS = {
    'pi': Math.PI,
    'e': Math.E
};

// إضافة مستمع لأحداث لوحة المفاتيح
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    // منع السلوك الافتراضي للمتصفح
    event.preventDefault();

    const key = event.key;
    
    // الأرقام والعمليات الأساسية
    if (/[0-9.]/.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '(', ')', '^'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Delete' || key === 'Escape') {
        clearDisplay();
    }
    
    // الوظائف العلمية باستخدام الحروف
    switch(key.toLowerCase()) {
        case 's':
            calculateTrig('sin');
            break;
        case 'c':
            calculateTrig('cos');
            break;
        case 't':
            calculateTrig('tan');
            break;
        case 'r':
            calculateFunction('sqrt');
            break;
        case 'l':
            calculateFunction('log');
            break;
        case 'p':
            calculateConstant('pi');
            break;
        case 'e':
            calculateConstant('e');
            break;
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('themeButton').textContent = isDarkMode ? '☀️' : '🌙';
}

function appendNumber(num) {
    if (lastWasResult) {
        currentInput = '';
        lastWasResult = false;
    }
    currentInput += num;
    display.value = currentInput;
}

function appendOperator(operator) {
    if (currentInput !== '' && !isLastCharOperator()) {
        lastWasResult = false;
        currentInput += operator;
        display.value = currentInput;
    }
}

function isLastCharOperator() {
    const operators = ['+', '-', '*', '/', '^', '(', ')'];
    return operators.includes(currentInput[currentInput.length - 1]);
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    lastWasResult = false;
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculateTrig(func) {
    try {
        const angle = eval(currentInput);
        // تحويل الزاوية من درجات إلى راديان
        const radians = angle * (Math.PI / 180);
        currentInput = Math[func](radians).toString();
        display.value = currentInput;
    } catch (error) {
        display.value = 'خطأ';
        currentInput = '';
    }
}

function calculateFunction(func) {
    try {
        const value = eval(currentInput);
        switch(func) {
            case 'sqrt':
                currentInput = Math.sqrt(value).toString();
                break;
            case 'log':
                currentInput = Math.log10(value).toString();
                break;
        }
        display.value = currentInput;
    } catch (error) {
        display.value = 'خطأ';
        currentInput = '';
    }
}

function calculateConstant(constant) {
    currentInput += CONSTANTS[constant].toString();
    display.value = currentInput;
}

function calculate() {
    try {
        if (currentInput) {
            let expression = currentInput.replace(/\^/g, '**');
            currentInput = eval(expression).toString();
            display.value = currentInput;
            lastWasResult = true; // تعيين المتغير إلى true بعد حساب النتيجة
        }
    } catch (error) {
        display.value = 'خطأ';
        currentInput = '';
        lastWasResult = false;
    }
}

// إضافة وظيفة إظهار/إخفاء التعليمات
function toggleHints() {
    const hintsPanel = document.getElementById('hintsPanel');
    hintsPanel.classList.toggle('hidden');
}

// إضافة تعليق توضيحي للمستخدم
function showKeyboardHint() {
    const hints = `
    مفاتيح لوحة المفاتيح:
    - الأرقام: 0-9
    - العمليات: +, -, *, /, (, ), ^
    - المسح: Backspace, Delete, Escape
    - النتيجة: Enter أو =
    - الدوال العلمية:
      * s: sin
      * c: cos
      * t: tan
      * r: sqrt (الجذر)
      * l: log
      * p: π
      * e: e
    `;
    console.log(hints);
}

// عرض التعليمات عند تحميل الصفحة
window.onload = function() {
    showKeyboardHint();
};
