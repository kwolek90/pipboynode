class LevelOne{
  constructor(game) {
    this.game = game;

    this.sprite = new Image();
    this.sprite.src = "sprites.png";
  }

  draw(ctx){
    // let sprite = new Image();
    // sprite.src = "../img/sprites.png";

    const redSteel = {
      sX: 222,
      sY: 272,
      w: 16,
      h: 8,
      x: 120, // przesunięcie bardziej na środek
      y: 148
    }

    // TOP FLOOR, PART 1
    let i;
    for (i = 0; i < 22; i++){
      ctx.drawImage(this.sprite,
      redSteel.sX,
      redSteel.sY,
      redSteel.w,
      redSteel.h,
      redSteel.x + (redSteel.w * this.game.scale)*i,
      redSteel.y,
      redSteel.w * this.game.scale,
      redSteel.h * this.game.scale);
    }

    // TOP FLOOR, PART 2
    let j;
    for (j = 1; j < 8; j++){
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w*this.game.scale*(22+j-1)),
        redSteel.y + j,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    // PENULTIMATE FLOOR
    let k;
    for (k = 1; k < 32; k++){
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w*this.game.scale*(27.5 - k)),
        redSteel.y + 46 + k,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
      }

    // FIFTH FLOOR
    let l;
    for (l = 1; l < 32; l++){
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w*this.game.scale*(27.3 - l)) - redSteel.w*this.game.scale,
        redSteel.y + 128 - l,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    // FOURTH FLOOR
    let m;
    for (m = 1; m < 32; m++){
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w * this.game.scale * (27.4 - m)),
        redSteel.y + 172 + m,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    // THIRD FLOOR
    let n;
    for (n = 1; n < 32; n++) {
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w * this.game.scale * (27.3 - n)) - redSteel.w * this.game.scale,
        redSteel.y + 260 - n,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    // SECOND FLOOR
    let o;
    for (o = 1; o < 32; o++) {
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w * this.game.scale * (27.4 - o)),
        redSteel.y + 300 + o,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    // FIRST FLOOR
    let p;
    for (p = 1; p < 32; p++) {
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + (redSteel.w * this.game.scale * (27.3 - p)) - redSteel.w * this.game.scale,
        redSteel.y + 380 - p,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }

    ctx.drawImage(this.sprite,
      redSteel.sX,
      redSteel.sY,
      redSteel.w,
      redSteel.h,
      700,
      527,
      redSteel.w * this.game.scale,
      redSteel.h * this.game.scale);

    // PRINCESS PLATFORM
    let q;
    for (q = 0; q < 5; q++) {
      ctx.drawImage(this.sprite,
        redSteel.sX,
        redSteel.sY,
        redSteel.w,
        redSteel.h,
        redSteel.x + 320 + (redSteel.w * this.game.scale) * q,
        redSteel.y - 64,
        redSteel.w * this.game.scale,
        redSteel.h * this.game.scale);
    }
  }
}

export default LevelOne;