const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i))
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
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}


const boundaries = []

const offset = {
    x: -730,
    y: -570
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) 
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
        
    })
})


c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Pellet Town.png'


const playerImage = new Image()
playerImage.src = './img/walk_Down.png'



const cropWidth = playerImage.width / 4; // Largura de um frame do sprite
const cropHeight = playerImage.height;  // Altura de um frame do sprite
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

const player = new Sprite({
    position: {
        x: 500, // x centralizado no canvas
        y: 300 // y centralizado no canvas
    },
    image: playerImage,
    frames: { max: 4 }, // Número de frames no sprite
});


const background = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    w: {
        pressed: false
    }, 
    s: {
        pressed: false
    }, 
    a: {
        pressed: false
    }, 
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries]

function rectangularCollision ({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate() {
    window.requestAnimationFrame(animate);

    // Desenha o background na posição atualizada
    background.draw();

    boundaries.forEach(boundary => {
        boundary.draw()

        if (
            rectangularCollision({
                rectangle1: player, 
                rectangle2: boundary
            })
        ) {
            console.log('colidindo');
        }
    });

    player.draw()


    // Movimento ao pressionar teclas
    if (keys.w.pressed && lastKey === 'w') {
        movables.forEach(movable => {movable.position.y += 3})
    }else if (keys.s.pressed && lastKey === 's') {
        movables.forEach(movable => {movable.position.y -= 3})
    }else if (keys.a.pressed && lastKey === 'a') {
        movables.forEach(movable => {movable.position.x += 3})
    }else if (keys.d.pressed && lastKey === 'd') {
        movables.forEach(movable => {movable.position.x -= 3})} // Movimenta o background para a esquerda
    
}


animate()

let lastKey = ''
window.addEventListener('keydown',(e) => {
 switch (e.key){
    case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break

    case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break

    case 's':
        keys.s.pressed = true
        lastKey = 's'
        break    
        
    case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break      
 }
})

window.addEventListener('keyup',(e) => {
    switch (e.key){
       case 'w':
           keys.w.pressed = false
           break
   
       case 'a':
           keys.a.pressed = false
           break
   
       case 's':
           keys.s.pressed = false
           break    
           
       case 'd':
           keys.d.pressed = false
           break      
    }
   })
