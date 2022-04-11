const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.height = innerHeight
canvas.width = innerWidth

class Player {
    constructor(){
        this.x = 10
        this.y = 10
        this.width = 100
        this.height = 100
    }


    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const player = new Player();
console.log(player)
player.draw()



