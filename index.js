const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+= 70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
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


const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) 
            battleZones.push(new Boundary({
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


const playerDownImage = new Image()
playerDownImage.src = './img/walk_Down.png'

const playerUpImage = new Image()
playerUpImage.src = './img/walk_Up.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/walk_Left.png'

const playerRightImage = new Image()
playerRightImage.src = './img/walk_Right.png'


const player = new Sprite({
    position: {
        x: 500, // x centralizado no canvas
        y: 300 // y centralizado no canvas
    },
    image: playerDownImage,
    frames: { 
        max: 4,
        hold: 20,
    }, // Número de frames no sprite
    sprites: {
        down: playerDownImage,
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
    }
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


const movables = [background, ...boundaries, foreground, ...battleZones]


function rectangularCollision ({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate);

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

    battleZones.forEach(battleZone =>{
        battleZone.draw()
    })


    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false
    
    if (battle.initiated) return

//ZONAS DE BATALHA
    if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea =
                Math.max(
                    
                    Math.min(
                        player.position.x + player.width,
                        battleZone.position.x + battleZone.width
                    ) - Math.max(player.position.x, battleZone.position.x)
                ) *
                Math.max(
                    
                    Math.min(
                        player.position.y + player.height,
                        battleZone.position.y + battleZone.height
                    ) - Math.max(player.position.y, battleZone.position.y)
                );
    
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01
            ) {
                console.log('zona');

                // desativar a animação atual
                window.cancelAnimationFrame(animationId)

                battle.initiated = true
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                // activate nova animação
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                
                break;
            }
        }
    }
    

    // Movimento ao pressionar teclas
    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
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
                moving = false
                break
            }
        } 
        if (moving)
        movables.forEach(movable => {movable.position.y += 3})

    }else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
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
                moving = false
                break
            }
        } 
        if (moving)
        movables.forEach(movable => {movable.position.y -= 3})

    }else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
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
                moving = false
                break
            }
        } 
        if (moving)
        movables.forEach(movable => {movable.position.x += 3})

    }else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
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
                moving = false
                break
            }
        } 

        if (moving)
        movables.forEach(movable => {movable.position.x -= 3})} // Movimenta o background para a esquerda
    
}


//animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite ({
    position:{
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'
const draggle = new Sprite ({
    position:{
        x: 800,
        y: 100,
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true
})

const embyImage= new Image()
embyImage.src = './img/embySprite.png'
const emby = new Sprite ({
    position:{
        x: 280,
        y: 325,
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true
})



function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()
    draggle.draw()
    emby.draw()
}
animateBattle()

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
