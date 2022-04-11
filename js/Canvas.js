const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const game = {
    gravity: 0.1
}


canvas.width = 1920/2
canvas.height = 1080/2
canvas.x = 0
canvas.y = 0


let keyPressed = new Map()
addEventListener('keydown', (e) => {
    keyPressed.set(e.code, 'true')
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

addEventListener('keyup', (e) => {
    // delete keyPressed[e.code] 
    keyPressed.delete(e.code)
})


class Helper {
    constructor(x, y, w, h, dx, dy) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.dx = dx
        this.dy = dy

        this.default = {
            x : x,
            y : y,
            w : w,
            h : h,
            dx: dx,
            dy: dy
        }
        
        
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
        this.isFalling = true
    }
    
    jump(){
        console.log("isfallign: " + this.isFalling)
        if (this.isJumping) return
        this.isJumping = true
        // this.y -= 1
        this.dy *= -1
    }
    
    fall(){
        this.isFalling = true
        
        platforms.forEach(platform => {
            if (this.getBottom() + this.dy > platform.getTop()){
                if (this.getRight() > platform.getLeft() && this.getLeft() < platform.getRight()){
                    this.setBottom(platform.getTop())
                    this.dy = player.jumpHeight
                    this.isJumping = false
                    this.isFalling = false
                }
                
            }
        })
        
        if (this.isFalling){
            this.y += this.dy
            this.dy += game.gravity;
            
            if (this.getTop() > canvas.height){
                this.reset()
            }
        }
            
    }
    
    
    reset(){
        this.x = this.default.x
        this.y = this.default.y
        this.w = this.default.w
        this.h = this.default.h
        this.dx = this.default.dx
        this.dy = this.default.dy
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
    
    action(){
        keyPressed.forEach((value, key) => {
            switch (key) {
                case "ArrowUp": ArrowUp(); break
                case "ArrowLeft": ArrowLeft(); break
                case "ArrowRight": ArrowRight(); break
            }
        });
    }

    onStep(){
        this.action()
        this.fall()
        this.draw()
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
    createPlatform(500, canvas.height - 100, 250, 30)
]
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.onStep()
    platforms.forEach(platform => platform.onStep())
}

animate()

