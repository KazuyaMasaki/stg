// シーンの管理
var idx = 0;
var score = 0;
var hiscore = 0;
var stage = 0;
// 自機の管理
var ssX = 0;
var ssY = 0;
var automa = 0;
var energy = 10;
var muteki = 0;
// 弾を管理する変数
var MSL_MAX = 100;
var mslX = new Array(MSL_MAX);
var mslY = new Array(MSL_MAX);
var mslXp = new Array(MSL_MAX);
var mslYp = new Array(MSL_MAX);
var mslF = new Array(MSL_MAX);
var mslImg = new Array(MSL_MAX);
var mslNum = 0;
var weapon = 1;
var laser = 0;
// 敵機を管理する変数
var OBJ_MAX = 100;
var objType = new Array(OBJ_MAX);
var objImg = new Array(OBJ_MAX);
var objX = new Array(OBJ_MAX);
var objY = new Array(OBJ_MAX);
var objXp = new Array(OBJ_MAX);
var objYp = new Array(OBJ_MAX);
var objLife = new Array(OBJ_MAX);
var objF = new Array(OBJ_MAX);
var objNum = 0;
// タイマー用変数
var timer = 0;
// エフェクトを管理する変数
var EF_MAX = 100;
var efX = new Array(EF_MAX);
var efY = new Array(EF_MAX);
var efN = new Array(EF_MAX);
var efNum = 0;

// 自機の初期化
function initSShip(){
  ssX = 400;
  ssY= 360;
  energy = 10;
}

// 敵機を管理する配列の初期化
function initObject(){
  for(var i = 0;i < OBJ_MAX;i++){
    objF[i] = false;
  }
  objNum = 0;
}

// 弾を管理する配列の初期化
function initMissile(){
  for(var i = 0;i < MSL_MAX;i++){
    mslF[i] = false;
  }
  mslNum = 0;
}

// エフェクトを管理する配列の初期化
function initEffect(){
  for(var i = 0;i < EF_MAX;i++){
    efN[i] = 0;
  }
  efNum = 0;
}

// 起動時の処理
function setup(){
  canvasSize(1200, 720);
  loadImg(0, 'image/bg.png');
  loadImg(1, 'image/spaceship.png');
  loadImg(2, 'image/missile.png');
  loadImg(3, 'image/explode.png');
  loadImg(4, 'image/enemy0.png');
  loadImg(5, 'image/enemy1.png');
  loadImg(6, 'image/enemy2.png');
  loadImg(7, 'image/enemy3.png');
  loadImg(8, 'image/enemy4.png');
  loadImg(9, 'image/item0.png');
  loadImg(10, 'image/item1.png');
  loadImg(11, 'image/item2.png');
  loadImg(12, 'image/laser.png');
  loadImg(13, 'image/title_ss.png');
  initSShip();
  initMissile();
  initObject();
  initEffect();
}

// メインループ
function mainloop(){
  timer++;
  draeBG(3);
  switch (idx) {
    // タイトル画面
    case 0:
      drawImg(13, 200, 200);
      if(timer % 40 < 20) {
        fText('Press [Space] or Click to start.', 600, 540, 40, 'cyan');
      }
      if(key[32] > 0 || tapC > 0){
        initSShip();
        initObject();
        score = 0;
        stage = 1;
        idx = 1;
        timer = 0;
      }
      break;

    // ゲーム中
    case 1:
      setEnemy();
      setItem();
      moveSShip();
      moveMissile();
      moveObject();
      drawEffect();
      for(var i = 0;i < 10;i++){
        fRect(20 + i * 30, 660, 20, 40, '#c00000');
      }
      for(var i = 0;i < energy;i++){
        fRect(20 + i * 30, 660, 20, 40, colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
      }
      if(timer < 30 * 4){
        fText('STAGE' + stage, 600, 300, 50, 'cyan');
      }
      if(30 * 114 < timer && timer < 30 * 118){
        fText('STAGE CLEAR!!', 600, 300, 50, 'cyan');
      }
      if(timer == 30 * 120){
        stage++;
        timer = 0;
      }
      break;
    
    // ゲームオーバー
    case 2:
      if(timer < 30 * 2 && timer % 5 == 1){
        setEffect(ssX + rnd(120) - 60, ssY + rnd(80) - 40, 9);
      }
      moveMissile();
      moveObject();
      drawEffect();
      fText('GAME OVER', 600, 300, 50, 'red');
      if(timer > 30 * 5) idx = 0;
      break;
    default:
      break;
  }
  
  fText('SCORE ' + score, 200, 50, 40, 'white');
  fText('HISCORE ' + hiscore, 600, 50, 40, 'yellow');
}

// 背景のスクロール
var bgX = 0;
function draeBG(spd){
  bgX = (bgX + spd) % 1200;
  drawImg(0, -bgX, 0);
  drawImg(0, 1200 - bgX, 0);
}

// 自機を動かす
function moveSShip(){
  if(key[37] > 0 && ssX > 60) ssX -= 20;
  if(key[39] > 0 && ssX < 1000) ssX += 20;
  if(key[38] > 0 && ssY > 40) ssY -= 20;
  if(key[40] > 0 && ssY < 680) ssY += 20;
  if(key[65] == 1){
    key[65]++;
    automa = 1- automa;
  }
  if(automa == 0 && key[32]  == 1) {
    key[32]++;
    setWeapon();
  }
  if(automa == 1 && timer % 8 == 0){
    setWeapon();
  }
  var color = 'black';
  if(automa == 1) color = 'white';
  fRect(900, 20, 280, 60, 'blue');
  fText('[A]uto Missile', 1040, 50, 36, color);

  // タップ操作
  if(tapC > 0){
    if(900 < tapX && tapX < 1180 && 20 < tapY && tapY < 80){
      tapC = 0;
      automa = 1- automa;
    }else{
      ssX = ssX + int((tapX - ssX) / 4);
      ssY = ssY + int((tapY - ssY) / 4);
    }
  }
  
  // 無敵処理
  if(muteki % 2 == 0) drawImgC(1, ssX, ssY);
  if(muteki > 0) muteki--;
}

// 弾を撃ち出す
function setMissile(x, y, xp, yp){
  mslX[mslNum] = x;
  mslY[mslNum] = y;
  mslXp[mslNum] = xp;
  mslYp[mslNum] = yp;
  mslF[mslNum] = true;
  mslImg[mslNum] = 2;
  // レーザー
  if(laser > 0){
    laser--;
    mslImg[mslNum] = 12;
  }
  mslNum = (mslNum + 1) % MSL_MAX;
}

// 弾を動かす
function moveMissile(){
  for(var i = 0;i < MSL_MAX;i++){
    if(mslF[i] == true){
      mslX[i] = mslX[i] + mslXp[i];
      mslY[i] = mslY[i] + mslYp[i];
      drawImgC(mslImg[i], mslX[i], mslY[i]);
      if(mslX[i] > 1200) mslF[i] = false;
    }
  }
}

// 複数の弾を一度に放つ
function setWeapon(){
  var n = weapon;
  if(n > 8) n = 8;
  for(var i = 0;i < n;i++){
    setMissile(ssX + 40, ssY - n * 6 + i * 12, 40, int((i - n / 2) * 2));
  }
}

// オブジェクト（敵機など）をセット
function setObject(typ, png, x, y, xp, yp, lif){
  objType[objNum] = typ;
  objImg[objNum] = png;
  objX[objNum] = x;
  objY[objNum] = y;
  objXp[objNum] = xp;
  objYp[objNum] = yp;
  objLife[objNum] = lif;
  objF[objNum] = true;
  objNum = (objNum + 1) % OBJ_MAX;
}

// 敵を出現させる
function setEnemy(){
  var sec = int(timer / 30); // 経過秒数
  if(4 <= sec && sec < 10){
    if(timer % 20 == 0) setObject(1, 5, 1300, 60 + rnd(600), -16, 0, 1 * stage); // 敵機1
  }
  if(14 <= sec && sec < 20){
    if(timer % 20 == 0) setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3 * stage); // 敵機2
  }
  if(24 <= sec && sec < 30){
    if(timer % 20 == 0) setObject(1, 7, 1300, 360 + rnd(300), -48, -10, 5 * stage); // 敵機3
  }
  if(34 <= sec && sec < 50){
    if(timer % 60 == 0) setObject(1, 8, 1300, rnd(720 - 192), -6, 0, 0); // 障害物
  }
  if(54 <= sec && sec < 70){
    if(timer % 20 == 0){
      setObject(1, 5, 1300, 60 + rnd(600), -16, 4, 1 * stage); // 敵機1
      setObject(1, 5, 1300, 360 + rnd(600), -16, -4, 1 * stage); // 敵機1
    }
  }
  if(74 <= sec && sec < 90){
    if(timer % 20 == 0) setObject(1, 6, 1300, 60 + rnd(600), -12, 8, 3 * stage); // 敵機2
    if(timer % 45 == 0) setObject(1, 8, 1300, rnd(720 - 192), -8, 0, 0); // 障害物
  }
  if(94 <= sec && sec < 110){
    if(timer % 10 == 0) setObject(1, 5, 1300, 360, -24, rnd(11) - 5, 1 * stage); // 敵機1
    if(timer % 45 == 0) setObject(1, 7, 1300, rnd(300), -56, 4 + rnd(12), 5 * stage); // 敵機3
  }
}

// 敵機を動かす
function moveObject(){
  for(var i = 0;i < OBJ_MAX;i++){
    if(objF[i] == true){
      objX[i] = objX[i] + objXp[i];
      objY[i] = objY[i] + objYp[i];
      // 敵2の動き
      if(objImg[i] == 6){
        if(objY[i] < 60) objYp[i] = 8;
        if(objY[i] > 660) objYp[i] = -8;
      }
      // 敵3の動き
      if(objImg[i] == 7){
        if(objXp[i] < 0){
          objXp[i] = int(objXp[i] * 0.95);
          if(objXp[i] == 0){
            setObject(0, 4, objX[i], objY[i], -20, 0, 0);
            objXp[i] = 20;
          }
        }
      }
      drawImgC(objImg[i], objX[i], objY[i]);
      // 敵機1は弾を発射する
      if(objType[i] == 1 && rnd(100) < 2) setObject(0, 4, objX[i], objY[i], -20, 0, 0);
      // 自機が撃った弾とヒットチェック
      if(objType[i] == 1){
        var r = 12 + (img[objImg[i]].width + img[objImg[i]].height) / 4;
        for(var n = 0;n < MSL_MAX;n++){
          if(mslF[n] == true){
            if(getDis(objX[i], objY[i], mslX[n], mslY[n]) < r){
              if(mslImg[n] == 2) mslF[n] = false; // 通常弾であれば弾を消す
              objLife[i]--;
              if(objLife[i] == 0){
                objF[i] = false;
                score += 100;
                if(score > hiscore) hiscore = score;
                setEffect(objX[i], objY[i], 9);
              }else{
                setEffect(objX[i], objY[i], 3);
              }
            }
          }
        }
      }
      // 自機とのヒットチェック
      var r = 30 + (img[objImg[i]].width + img[objImg[i]].height) / 4;
      if(getDis(objX[i], objY[i], ssX, ssY) < r){
        if(objType[i] <= 1 && muteki == 0){
          objF[i] = false;
          energy--;
          muteki = 30;
          if(energy == 0){
            idx = 2;
            timer = 0;
          }
        }
        // アイテム
        if(objType[i] == 2){
          objF[i] = false;
          if(objImg[i] == 9 && energy < 10) energy++;
          if(objImg[i] == 10) weapon++;
          if(objImg[i] == 11) laser = laser + 100;
        }
      }
      if(objX[i] < -100 || objX[i] > 1300 || objY[i] < -100 || objY[i] > 820){
        objF[i] = false;
      }
    }
  }
}

// アイテムを出現させる
function setItem(){
  if(timer % 90 == 0) setObject(2, 9, 1300, 60 + rnd(600), -10, 0, 0); // エネルギー回復
  if(timer % 90 == 30) setObject(2, 10, 1300, 60 + rnd(600), -10, 0, 0); // エネルギー回復
  if(timer % 90 == 60) setObject(2, 11, 1300, 60 + rnd(600), -10, 0, 0); // エネルギー回復
}

// エフェクトをセット
function setEffect(x, y, n){
  efX[efNum] = x;
  efY[efNum] = y;
  efN[efNum] = n;
  efNum = (efNum + 1) % EF_MAX;
}

// エフェクトを表示
function drawEffect(){
  for(var i = 0;i < EF_MAX;i++){
    if(efN[i] > 0){
      drawImgTS(3, (9 - efN[i]) * 128, 0, 128, 128, efX[i] - 64, efY[i] - 64, 128, 128);
      efN[i]--;
    }
  }
}