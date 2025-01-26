const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i))
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


const foregroundImage = new Image()
foregroundImage.src = './img/foregroundsObjects.png'


const playerImage = new Image()
playerImage.src = './img/walk_Down.png'


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


const foreground = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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


const movables = [background, ...boundaries, foreground]


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
    foreground.draw()
    let moving = true

    // Movimento ao pressionar teclas
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0 ; i < boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
                console.log('colidindo');
                moving = false
                break
            }
        } 

        if (moving)
        movables.forEach(movable => {movable.position.y += 3})
    }else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0 ; i < boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) {
                console.log('colidindo');
                moving = false
                break
            }
        } 

        if (moving)
        movables.forEach(movable => {movable.position.y -= 3})
    }else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0 ; i < boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
            ) {
                console.log('colidindo');
                moving = false
                break
            }
        } 

        if (moving)
        movables.forEach(movable => {movable.position.x += 3})
    }else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0 ; i < boundaries.length; i++){
            const boundary = boundaries [i]
            if (
                rectangularCollision({
                    rectangle1: player, 
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }}
                })
            ) {
                console.log('colidindo');
                moving = false
                break
            }
        } 

        if (moving)
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
