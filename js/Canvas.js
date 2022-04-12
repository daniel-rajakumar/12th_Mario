const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const game = {
    gravity: 0.2
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
        
        this.default = { x, y,  w, h, dx, dy }
        // console.log(this.default)
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
    
    constructor(x, y, w, h, dx, dy){
        super(x, y, w, h, dx, dy)
        this.jumpHeight = 8
        // this.canMoveRight = true;
        // this.canMoveLeft = true;
    }
    
    jump(){
        // console.log("isfallign: " + this.onAir)
        if (!this.onGround) return
        this.onGround = false
        this.dy *= -1
    }
    
    fall(){
        this.onGround = false
        
        if (!this.canMoveUp){
            this.dy *= -1;
        }
        
        platforms.forEach(platform => {
            if (this.getRight() > platform.getLeft() && this.getLeft() < platform.getRight()){
                if (this.getBottom() + this.dy > platform.getTop() && this.getTop() < platform.getBottom()) {
                    this.setBottom(platform.getTop())
                    this.dy = player.jumpHeight
                    this.onGround = true
                }
            }
        })
        
        if (!this.onGround){
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
        

        platforms.forEach(platform => {
            platform.x = platform.default.x
        })
        
    }
    
    
    moveLeft(){
        // console.log(`player: ${this.x} | canvas : ${canvas.x}`)
        if (this.canMoveLeft){
            if (this.getLeft() > canvas.width * 0.1){
                this.x -= this.dx
                // this.dx += 1
            } else {
                platforms.forEach(platform => platform.x += this.dx )
            }
        }
        
    }
    
    moveRight(){
        if (this.canMoveRight) {
            if (this.getRight() < canvas.width * 0.5) {
                this.x += this.dx
                // this.dx += 1
            } else {
                platforms.forEach(platform => platform.x -= this.dx)
            }
        }
    }

    checkMovementArea(){
        this.canMoveLeft = true
        this.canMoveRight = true
        this.canMoveUp = true
        
        
        platforms.forEach(platform => {
            if (this.getBottom() > platform.getTop() && this.getTop() < platform.getBottom()) {
                this.canMoveRight = !(Math.abs(this.getRight() - platform.getLeft()) < this.dx)
                this.canMoveLeft = !(Math.abs(this.getLeft() - platform.getRight()) < this.dx)
            }

            if (this.getRight() > platform.getLeft() && this.getLeft() < platform.getRight()) {
                this.canMoveUp = !(Math.abs(this.getTop() - platform.getBottom()) < 5)
            }
        });
    }
    
    
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
    keyPress(){
        keyPressed.forEach((_, key) => {
            switch (key) {
                case "ArrowUp": ArrowUp(); break
                case "ArrowLeft": ArrowLeft(); break
                case "ArrowRight": ArrowRight(); break
            }
        });
    }

    onStep(){
        this.checkMovementArea()
        this.keyPress()
        this.fall()
        this.draw()
    }
}


function createMap(){
    platforms.push(createPlatform(0, 0, 300, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() - 100, 225, 300, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() - 100, 0, 3000, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() -2600, 75, 300, 50))
}



function createPlatform(x_fromLeft, y_fromBottom, w, h){
    const platform = new Platform(0, 0, w, h)
    
    platform.setLeft(x_fromLeft)
    platform.setBottom(canvas.height - y_fromBottom)
    
    platform.default.x = platform.x
    platform.default.y = platform.y
    
    return platform;
}


    
const player = new Player(20, 20, 50, 50, 10, 10);
const platforms = []

createMap()
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.onStep()
    platforms.forEach(platform => platform.onStep())
}

animate()

