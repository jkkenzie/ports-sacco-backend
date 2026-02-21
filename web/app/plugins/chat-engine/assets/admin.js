jQuery(document).ready(function($) {
    // Auto-expand textareas
    $('textarea').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Confirm delete
    $('a[href*="delete="]').on('click', function(e) {
        if (!confirm('Are you sure you want to delete this FAQ?')) {
            e.preventDefault();
        }
    });
});
