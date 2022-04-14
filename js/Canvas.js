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

addEventListener('keypress', ({code}) => {
    console.log(code)
})


addEventListener('keydown', ({code}) => {
    keyPressed.set(code, 'true')
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
    // delete keyPressed[e.code] 
    keyPressed.delete(code)
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
    // setRight(val){ this.x = val - this.w }
    setBottom(val){ this.y = val - this.h }
    // setTop(val){ this.y = val }

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
        ctx.fillStyle = 'black'
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
        this.frameX = 0
        this.frameY = 0
        this.image = "./img/stand_right.png"
        this.count = 0
    }
    
    jump(){
        // console.log("isfallign: " + this.onAir)
        if (this.canMoveDown) return
        this.canMoveDown = true
        this.dy = -player.jumpHeight
    }
    
    fall(){
        if (!this.canMoveUp){
            this.dy *= -1;
        }
        
        if (this.canMoveDown){
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
            this.prevMoveDir = 'left'
            this.image = "./img/run_left.png"
            if (this.getLeft() > canvas.width * 0.1){
                this.x -= this.dx
                // this.dx += 1
            } else {
                platforms.forEach(platform => platform.x += this.dx)
            }
        }
        
    }
    
    moveRight(){
        if (this.canMoveRight) {
            this.prevMoveDir = 'right'
            this.image = "./img/run_right.png"
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
        this.canMoveDown = true
        let crop = {
            bottom: 20,
            right: 20
        }
        
        
        platforms.forEach(platform => {
            if (this.getBottom() > platform.getTop() && this.getTop() < platform.getBottom()) {
                if (Math.abs(this.getLeft() - platform.getRight()) < this.dx){
                    this.canMoveLeft = false
                }
                if (Math.abs(this.getRight() - platform.getLeft()) < this.dx){
                    this.canMoveRight = false 
                }
            }
            
            if ((this.getRight() - this.w/3) > platform.getLeft() && (this.getLeft() + this.w/3) < platform.getRight()) {
                if ((Math.abs(this.getTop() - platform.getBottom()) < 5)){
                    this.canMoveUp = false;
                }

                if ((this.getBottom() >= platform.getTop() + crop.bottom) && this.getTop() < platform.getBottom()) {
                    this.setBottom(platform.getTop() + crop.bottom)
                    this.canMoveDown = false
                }
            }
        });

    }


    draw(){
        this.count++
        let image = new Image();
        // console.log(`${this.count} + ${this.image}`)
        image.src = this.image
        let size = {
            w: 794,
            h: 1123
        }
        ctx.drawImage(image, Math.floor(this.frameX) * size.w, (Math.floor(this.frameY) * size.h), (size.w - 50), size.h, this.x, this.y, this.w, this.h)
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
    keyPress(){
        if (this.prevMoveDir === 'left'){
            this.image = "./img/stand_left.png"
        } else if (this.prevMoveDir === 'right'){
            this.image = "./img/stand_right.png"
        }
        
        keyPressed.forEach((_, key) => {
            switch (key) {
                case "ArrowUp": ArrowUp(); break
                case "ArrowLeft": ArrowLeft(); break
                case "ArrowRight": ArrowRight(); break
            }
        });
        
    }
    
    loopSprite(){
        this.frameX += 0.75
        this.frameX %= 60
    }

    onStep(){
        this.loopSprite()
        this.checkMovementArea()
        this.keyPress()
        this.fall()
        this.draw()
    }
}


function createMap(){
    platforms.push(createPlatform(0, 0, 300, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() - 100, 225, 600, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() - 300, 0, 3000, 50))
    platforms.push(createPlatform(platforms.slice(-1).pop().getRight() -2600, 145, 300, 200))
}



function createPlatform(x_fromLeft, y_fromBottom, w, h){
    const platform = new Platform(null, null, w, h)
    
    platform.setLeft(x_fromLeft)
    platform.setBottom(canvas.height - y_fromBottom)
    
    platform.default.x = platform.x
    platform.default.y = platform.y
    
    return platform;
}


    
const player = new Player(20, 20, 150, 150, 10, 10);
const platforms = []

setInterval(function(){
    //code goes here that will be run every 5 seconds.    
    console.log()
}, 1000);

createMap()
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.onStep()
    platforms.forEach(platform => platform.onStep())
}

animate()


