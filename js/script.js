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

    const DIGITOS_CELULAR_BR = 11;

    function apenasDigitos(s) {
        return String(s).replace(/\D/g, '');
    }

    function formatarCelularBR(valor) {
        const d = apenasDigitos(valor).slice(0, DIGITOS_CELULAR_BR);
        if (d.length === 0) return '';
        if (d.length <= 2) return `(${d}`;
        if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    }

    function celularBRValido(valor) {
        const d = apenasDigitos(valor);
        if (d.length !== DIGITOS_CELULAR_BR) return false;
        if (d[2] !== '9') return false;
        const ddd = parseInt(d.slice(0, 2), 10);
        return ddd >= 11 && ddd <= 99;
    }

    function emailPareceValido(s) {
        const t = String(s).trim();
        if (!t) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(t);
    }

    function limparEstadosGrupo(grupo) {
        if (!grupo) return;
        grupo.classList.remove('is-valid', 'is-warning', 'is-invalid');
    }

    const telInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const grupoTelefone = document.getElementById('grupo-telefone');
    const grupoEmail = document.getElementById('grupo-email');
    const feedbackTelefone = document.getElementById('feedback-telefone');
    const feedbackEmail = document.getElementById('feedback-email');

    function atualizarFeedbackTelefone() {
        if (!telInput || !grupoTelefone || !feedbackTelefone) return;
        const d = apenasDigitos(telInput.value);
        limparEstadosGrupo(grupoTelefone);
        if (d.length === 0) {
            feedbackTelefone.textContent = '';
            return;
        }
        if (!celularBRValido(telInput.value)) {
            if (d.length < DIGITOS_CELULAR_BR) {
                grupoTelefone.classList.add('is-warning');
                const faltam = DIGITOS_CELULAR_BR - d.length;
                feedbackTelefone.textContent =
                    `Continue digitando… faltam ${faltam} número${faltam > 1 ? 's' : ''} (11 com DDD, ex.: ${formatarCelularBR('11987654321')}).`;
            } else {
                grupoTelefone.classList.add('is-invalid');
                feedbackTelefone.textContent =
                    'Use celular com 9 após o DDD — ex.: (11) 98765-4321 (o terceiro dígito deve ser 9).';
            }
            return;
        }
        grupoTelefone.classList.add('is-valid');
        feedbackTelefone.textContent = '✓ Número completo no formato brasileiro.';
    }

    function atualizarFeedbackEmail() {
        if (!emailInput || !grupoEmail || !feedbackEmail) return;
        const t = emailInput.value.trim();
        limparEstadosGrupo(grupoEmail);
        if (t.length === 0) {
            feedbackEmail.textContent = '';
            return;
        }
        if (emailPareceValido(t)) {
            grupoEmail.classList.add('is-valid');
            feedbackEmail.textContent = '✓ E-mail no formato correto.';
            return;
        }
        if (!t.includes('@')) {
            grupoEmail.classList.add('is-warning');
            feedbackEmail.textContent = 'Inclua o @ e o domínio (ex.: nome@gmail.com).';
            return;
        }
        grupoEmail.classList.add('is-invalid');
        feedbackEmail.textContent = 'Complete depois do @ com domínio válido (ex.: outlook.com.br).';
    }

    if (telInput) {
        telInput.addEventListener('input', () => {
            const antes = telInput.value;
            const fmt = formatarCelularBR(antes);
            if (fmt !== antes) telInput.value = fmt;
            atualizarFeedbackTelefone();
        });
        telInput.addEventListener('blur', atualizarFeedbackTelefone);
    }

    if (emailInput) {
        emailInput.addEventListener('input', atualizarFeedbackEmail);
        emailInput.addEventListener('blur', atualizarFeedbackEmail);
    }

    // Formspree Form Submission Logic
    const leadForm = document.querySelector('.lead-form');
    // URL do Formspree - Substitua SEU_ID_AQUI pelo ID real do seu formulário
    // Para criar: https://formspree.io
    const FORMSPREE_URL = 'https://formspree.io/f/xdawybgo';

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const email = document.getElementById('email').value.trim();
            const origem = document.getElementById('origem').value;
            const desejos = document.getElementById('desejos').value.trim();

            const responseMessage = document.querySelector('.form-response');
            responseMessage.textContent = '';
            responseMessage.classList.remove('success', 'error');

            if (!celularBRValido(telefone)) {
                responseMessage.textContent =
                    'Informe um celular válido: DDD (2 dígitos) + 9 + mais 8 dígitos — 11 números no total.';
                responseMessage.classList.add('error');
                atualizarFeedbackTelefone();
                telInput?.focus();
                return;
            }

            if (!emailPareceValido(email)) {
                responseMessage.textContent = 'Por favor, confira o e-mail (formato nome@provedor.com).';
                responseMessage.classList.add('error');
                atualizarFeedbackEmail();
                emailInput?.focus();
                return;
            }

            // Botão feedback
            const btn = leadForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando seus dados... 🌿';
            btn.disabled = true;

            // Dados a enviar
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('telefone', telefone);
            formData.append('email', email);
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
                    responseMessage.textContent = 'Sucesso! E-book enviado para seu e-mail em instantes.';
                    responseMessage.classList.add('success');
                    leadForm.reset();
                    if (feedbackTelefone) feedbackTelefone.textContent = '';
                    if (feedbackEmail) feedbackEmail.textContent = '';
                    limparEstadosGrupo(grupoTelefone);
                    limparEstadosGrupo(grupoEmail);

                    // Após 3 segundos, volta ao normal
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        responseMessage.textContent = '';
                        responseMessage.classList.remove('success');
                    }, 3000);
                } else {
                    throw new Error('Erro na resposta do servidor');
                }
            })
            .catch(error => {
                // Erro
                console.error('Erro ao enviar formulário:', error);
                responseMessage.textContent = '⚠️ Ocorreu um erro ao enviar. Tente novamente em instantes.';
                responseMessage.classList.add('error');
                btn.innerText = '❌ Erro ao enviar. Tente novamente.';
                btn.style.background = '#dc3545';

                // Após 3 segundos, volta ao normal
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    responseMessage.textContent = '';
                    responseMessage.classList.remove('error');
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
