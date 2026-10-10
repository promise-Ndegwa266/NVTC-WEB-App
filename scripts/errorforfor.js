document.addEventListener('DOMContentLoaded', function() {
            var codeElement = document.querySelector('.error-code .code');
            if (codeElement) {
                var originalText = codeElement.textContent;
                codeElement.textContent = '0';
                var target = parseInt(originalText, 10);
                var duration = 800;
                var startTime = null;

                function animateNumber(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var current = Math.floor(progress * target);
                    codeElement.textContent = current;
                    if (progress < 1) {
                        requestAnimationFrame(animateNumber);
                    } else {
                        codeElement.textContent = originalText;
                    }
                }

                requestAnimationFrame(animateNumber);
            }

            var container = document.querySelector('.error-container');
            document.addEventListener('mousemove', function(e) {
                var x = (e.clientX / window.innerWidth - 0.5) * 6;
                var y = (e.clientY / window.innerHeight - 0.5) * 6;
                container.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            });
        });