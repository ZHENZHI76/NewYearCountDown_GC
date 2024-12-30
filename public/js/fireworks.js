class Firework {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.fireworks = [];
        this.running = true;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeFireworks();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeFireworks() {
        setInterval(() => {
            if (Math.random() < 0.6) { // 提高发射概率
                this.createFirework();
            }
            // 随机添加多个烟花
            if (Math.random() < 0.3) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => this.createFirework(), i * 100);
                }
            }
        }, 400); // 缩短发射间隔

        this.animate();
    }

    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = this.canvas.height * (0.2 + Math.random() * 0.4); // 控制爆炸高度
        const speed = 4 + Math.random() * 4;

        // 更喜庆的烟花颜色组合
        const colors = [
            { hue: 45, saturation: 100, lightness: 60 },    // 金色
            { hue: 0, saturation: 100, lightness: 60 },     // 红色
            { hue: 35, saturation: 100, lightness: 60 },    // 橙色
            { hue: 15, saturation: 100, lightness: 60 },    // 橙红色
            { hue: 55, saturation: 100, lightness: 60 }     // 亮金色
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        this.fireworks.push({
            x,
            y,
            targetY,
            speed,
            angle: Math.atan2(targetY - y, 0),
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
            size: 2 + Math.random() * 2 // 随机大小
        });
    }

    createParticles(x, y, color) {
        const particleCount = 80 + Math.floor(Math.random() * 40); // 增加粒子数量
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 4;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: color.hue,
                saturation: color.saturation,
                lightness: color.lightness,
                alpha: 1,
                decay: 0.01 + Math.random() * 0.01
            });
        }
    }

    animate() {
        if (!this.running) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新烟花
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.y -= firework.speed;

            if (firework.y <= firework.targetY) {
                this.createParticles(firework.x, firework.y, firework.hue);
                this.fireworks.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(firework.x, firework.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${firework.hue}, ${firework.saturation}%, ${firework.lightness}%)`;
            this.ctx.fill();
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.05; // 重力
            particle.alpha -= particle.decay;

            if (particle.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.brightness}%, ${particle.alpha})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}
