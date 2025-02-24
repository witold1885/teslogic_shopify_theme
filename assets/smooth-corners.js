class SmoothCorners {
    static get inputProperties() {
        return ['--smooth-radius'];
    }
  
    paint(ctx, size, properties) {
        const radius = parseFloat(properties.get('--smooth-radius')) || 0;
        const w = size.width;
        const h = size.height;

        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(w - radius, 0);
        ctx.quadraticCurveTo(w, 0, w, radius);
        ctx.lineTo(w, h - radius);
        ctx.quadraticCurveTo(w, h, w - radius, h);
        ctx.lineTo(radius, h);
        ctx.quadraticCurveTo(0, h, 0, h - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
    }
}

registerPaint('smoothCorners', SmoothCorners);
  