class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            velocity: {
                x: Math.random() * 6 - 3,
                y: Math.random() * 6 - 3
            },
            alpha: 1
        };
    }

    explode(x, y) {
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle(x, y));
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.velocity.y += 0.1;
            particle.alpha -= 0.01;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.color}, ${particle.alpha})`;
            this.ctx.fill();

            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });

        if (Math.random() < 0.05) {
            this.explode(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height * 0.5
            );
        }

        requestAnimationFrame(() => this.animate());
    }
}

const fireworks = new Firework(document.getElementById('fireworks')); 