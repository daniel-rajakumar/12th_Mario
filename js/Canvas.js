const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1920/2
canvas.height = 1080/2
canvas.x = 0
canvas.y = 0

addEventListener('keydown', ({code}) => {
    player.updateVariables()
    switch (code){
        case "ArrowUp": ArrowUp(); break
        case "ArrowLeft": ArrowLeft(); break
        case "ArrowRight": ArrowRight(); break
    }
})

function ArrowRight(){
    player.moveRight()
}

function ArrowLeft(){
    player.moveLeft()
}

function ArrowUp(){
}

addEventListener('keyup', ({code}) => {
    switch (code){
        
    }
})


class Player {
    constructor(){
        this.x = 10
        this.y = 10
        this.w = 50
        this.h = 50
        this.dx = 10;
        this.dy = 10;
        
    }
    
    setLeft(val){ this.x = val }
    setRight(val){ this.x = val - this.w }
    setBottom(val){ this.y = val - this.h }
    setTop(val){ this.y = val }
    
    
    getLeft(){ return this.x }
    getRight(){ return this.x + this.w }
    getBottom(){ return this.y + this.h }
    getTop(){ return this.y }
    
    updateVariables(){
        this.up = this.y
        this.bottom = this.y + this.h
    }
    
    jump(){
        
    }
    
    fall(){
        if (this.getBottom() < canvas.height){
            this.y += this.dy
        } else {
            this.setBottom(canvas.height)
        }
    }
    
    moveLeft(){
        console.log(`player: ${this.x} | canvas : ${canvas.x}`)
        if (this.getLeft() > canvas.x){
            this.x -= this.dx
            // this.dx += 1
        } else {
            this.setLeft(canvas.x)
        }
        
    }
    
    moveRight(){
        console.log(`player: ${this.getRight()} | canvas : ${canvas.width}`)
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





    
const player = new Player();
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.onStep()
}
animate()

