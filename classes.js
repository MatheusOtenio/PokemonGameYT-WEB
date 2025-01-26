class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 }}) {
        this.position = position;
        this.image = image;
        this.frames = frames;
       
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
    }

    draw() {
        c.drawImage(
            this.image,
            0, // x de recorte (início do sprite)
            0, // y de recorte
            this.image.width / this.frames.max, // largura do recorte
            this.image.height, // altura do recorte
            this.position.x,
            this.position.y,
            (this.image.width / this.frames.max), // largura escalada
            this.image.height
        );
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) { // Receber o parâmetro position
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
