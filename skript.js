document.addEventListener('DOMContentLoaded', () => {

    // 1. Stat Counter (Sanagichlar animatsiyasi)
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = 200; // tezlik

            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target.toLocaleString() + "+";
            }
        };

        updateCount();
    });

    // 2. Kurslarni Filtr qilish
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active klassini yangilash
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Quiz Modal
    const quizBtn = document.getElementById('quizBtn');
    const quizModal = document.getElementById('quizModal');
    const closeModal = document.getElementById('closeModal');
    const quizOpts = document.querySelectorAll('.quiz-opt');
    const quizResult = document.getElementById('quizResult');

    quizBtn.addEventListener('click', () => {
        quizModal.style.display = 'flex';
        quizResult.style.display = 'none';
    });

    closeModal.addEventListener('click', () => {
        quizModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === quizModal) {
            quizModal.style.display = 'none';
        }
    });

    quizOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const result = opt.getAttribute('data-result');
            quizResult.innerText = `Siz uchun tavsiya etiladigan kurs: ${result}!`;
            quizResult.style.display = 'block';
        });
    });

});