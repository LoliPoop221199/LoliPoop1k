// Código otimizado para bloquear inspeção e menu de contexto sem interferir em outros elementos
(function() {
    // Utilizando passive: false apenas quando necessário
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // Otimizado para verificar apenas as teclas que importam
    document.addEventListener('keydown', function(event) {
        // Verificamos primeiro o keyCode para evitar verificações desnecessárias
        if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
            event.preventDefault();
            return false;
        }
    }, { passive: false, capture: false });
})();