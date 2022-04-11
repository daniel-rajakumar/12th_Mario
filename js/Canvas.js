const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const game = {
    gravity: 0.1
}


canvas.width = 1920/2
canvas.height = 1080/2
canvas.x = 0
canvas.y = 0

addEventListener('keydown', ({code}) => {
    console.log(code)
    // switch (code){
    //     case "ArrowUp": ArrowUp(); break
    //     case "ArrowLeft": ArrowLeft(); break
    //     case "ArrowRight": ArrowRight(); break
    // }
})

function ArrowRight(){
    player.moveRight()
}

function ArrowLeft(){
    player.moveLeft()
}

function ArrowUp(){
    player.jump()
}

addEventListener('keyup', ({code}) => {
    switch (code){
        
    }
})


class Helper {
    constructor(x, y, w, h, dx, dy) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.dx = dx
        this.dy = dy
    }
    
    setLeft(val){ this.x = val }
    setRight(val){ this.x = val - this.w }
    setBottom(val){ this.y = val - this.h }
    setTop(val){ this.y = val }

    getLeft(){ return this.x }
    getRight(){ return this.x + this.w }
    getBottom(){ return this.y + this.h }
    getTop(){ return this.y }
}

class Platform extends Helper {
    constructor(x, y, w, h) {
        super(x, y, w, h, 0, 0);
    }

    draw(){
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
    onStep(){
        this.draw()
    }
    
}


class Player extends Helper {
    
    constructor(x, y, w, h, xy, dy){
        super(x, y, w, h, xy, dy)
        this.jumpHeight = 8
    }
    
    jump(){
        console.log(this.dy)
        this.y -= 1
        this.dy *= -1
    }
    
    fall(){
        if (this.getBottom() < canvas.height){
            platforms.forEach(platforms => {
                if (this.getBottom() + this.dy < platforms.getTop()) {
                    this.y += this.dy
                    this.dy += game.gravity;
                }  else {
                    this.dy = player.jumpHeight
                    this.setBottom(platforms.getTop())
                }
            })
            
            // if (this.getBottom() < )
        } else {
            this.setBottom(canvas.height)
        }
    }
    
    moveLeft(){
        // console.log(`player: ${this.x} | canvas : ${canvas.x}`)
        if (this.getLeft() > canvas.x){
            this.x -= this.dx
            // this.dx += 1
        } else {
            this.setLeft(canvas.x)
        }
        
    }
    
    moveRight(){
        // console.log(`player: ${this.getRight()} | canvas : ${canvas.width}`)
        if (this.getRight() < canvas.width){
            this.x += this.dx
            // this.dx += 1
        } else {
            this.setRight(canvas.width)
        }
    }
    
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    onStep(){
        this.fall()
        this.draw()
        // this.updateVariables()
    }
}





function createPlatform(x_fromLeft, y_fromBottom, w, h){
    const platform = new Platform(0, 0, w, h)
    
    
    platform.setLeft(x_fromLeft)
    platform.setBottom(y_fromBottom)
    
    
    return platform;
}


    
const player = new Player(20, 20, 50, 50, 10, 10);
const platforms = [
    createPlatform(0, canvas.height, 350, 30),
    createPlatform(400, canvas.height, 250, 30)
]
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.onStep()
    
    platforms.forEach(platform => platform.onStep())
}
animate()

