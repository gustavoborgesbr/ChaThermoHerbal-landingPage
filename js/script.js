document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formspree Form Submission Logic
    const leadForm = document.querySelector('.lead-form');
    // URL do Formspree - Substitua SEU_ID_AQUI pelo ID real do seu formulário
    // Para criar: https://formspree.io
    const FORMSPREE_URL = 'https://formspree.io/f/xdawybgo';

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const origem = document.getElementById('origem').value;
            const desejos = document.getElementById('desejos').value;

            // Botão feedback
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando seus dados... 🌿';
            btn.disabled = true;

            // Dados a enviar
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('origem', origem);
            formData.append('desejos', desejos);
            formData.append('_subject', 'Novo Lead - Thermo Detox Herbal');
            formData.append('_next', window.location.href); // Redirecionar para a mesma página

            // Envia para Formspree
            fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Sucesso
                    btn.innerText = '✅ Dados enviados com sucesso!';
                    btn.style.background = '#28a745';
                    leadForm.reset();

                    // Após 3 segundos, volta ao normal
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Erro na resposta do servidor');
                }
            })
            .catch(error => {
                // Erro
                console.error('Erro ao enviar formulário:', error);
                btn.innerText = '❌ Erro ao enviar. Tente novamente.';
                btn.style.background = '#dc3545';

                // Após 3 segundos, volta ao normal
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dots = Array.from(document.querySelectorAll('.dot'));
        
        let currentIndex = 0;
        
        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
            
            currentIndex = index;
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
        });

        // AutoPlay (opcional) a cada 5 segundos
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        }, 5000);
    }
});
