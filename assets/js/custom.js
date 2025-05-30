// Custom JavaScript for Portfolio

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the timeline content is visible
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.display = 'block';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
        
        const content = item.querySelector('.timeline-content');
        if (content) {
            content.style.display = 'block';
            content.style.visibility = 'visible';
            content.style.opacity = '1';
        }
    });
    
    // Add animations for experience items
    setTimeout(() => {
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * 200);
        });
    }, 500);
});
