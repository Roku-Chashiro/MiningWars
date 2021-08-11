//カードの名前と効果の在り処を呼び出すモジュール
const Card= require( './Card.js');
//カードの名前と効果の在り処を呼び出すモジュール
module.exports = class Character{

  //フィールドの準備(スコープ等細かい調節は後から行う)
  //キャメル記法を参考に命名する
  maxHP;          //最大体力
  currentHP;      //現在の体力
  view = [];      //視野、フィルタ用に配列を入れる
  moveSpeed = []; //移動可能なマス
  pocket = [];    //持ち物
  pocketSize = 3; //持ち物が持てる個数を表す
  coordinate = [];//座標[Y,X]
  playerNo;       //所属先のプレイヤーのNoを格納する
  mines;          //採掘回数の格納
  direction;      //向いている方向を格納する(0:上,1:左,2:右,3:下)
  myNo;           //プレイヤーから見たキャラクターの添字
  visibilityRotation; //関数を入れてみる

  //コンストラクタ
  //座標と所属先のプレイヤーNoを送られて生成する  
  constructor(Y,X,playerNo,myNo){
    this.coordinate[0] = Y;
    this.coordinate[1] = X;
    this.playerNo = playerNo;
    this.maxHP = 100;
    this.currentHP = this.maxHP;
    this.characterFiestView();
    this.CharacterFierstMove();
    //console.log("視界:",this.view);
    this.pocket = new Array(0);
    //for(var i=0;i < this.pocketSize;i++){
    //  this.pocket[i] = (new Card(1,0,0));//空白のカードを入れる;
    //}
    //this.pocket = new Array(0);
    this.mines = 0;
    this.direction = 0;
    this.myNo = myNo;
    //console.log('PlayerNo=%d,X=%d,Y=%d',playerNo,this.coordinate[0],this.coordinate[1]);
    
    this.visibilityRotation =  function visibilityRotation(direction){
      //一度(0:上)に戻す
      var viewCopy = this.view;
      if(this.direction == 1){
        for(var i=0;i < viewCopy.length;i++){
          this.view[i] = [this.viewCopy[i][1],this.viewCopy[i][0]];
        }
      } else if(this.direction == 2){
        for(var i=0;i < viewCopy.length;i++){
          this.view[i] = [this.viewCopy[i][1],(this.viewCopy[i][0] * -1)];
        }
      } else if(this.direction == 3){
        for(var i=0;i < viewCopy.length;i++){
          this.view[i] = [(this.viewCopy[i][0] * -1),this.viewCopy[i][1]];
        }
      }
      //再度代入
      viewCopy = this.view;
      if(direction == 1){
        for(var i=0;i < view.length;i++){
          this.view[i] = [this.viewCopy[i][1],this.viewCopy[i][0]];
        }
      } else if(direction == 2){
        for(var i=0;i < view.length;i++){
          this.view[i] = [this.viewCopy[i][1],(this.viewCopy[i][0] * -1)];
        }
      } else if(direction == 3){
        for(var i=0;i < view.length;i++){
          this.view[i] = [(this.viewCopy[i][1] * -1),this.viewCopy[i][0]];
        }
      }
      //方向入れかえ
      this.direction = direction;
    }
    //console.log(this.visibilityRotation);
  }

  //初期のキャラクターの視界
  characterFiestView(){//[Y,X]
    /*this.view[0] = [-1,0];//上
    this.view[1] = [0,-1];//左
    this.view[2] = [0,1]; //右
    this.view[3] = [1,0];*/ //下
    //試験用視界
    this.view[0] = [-1,0];
    this.view[1] = [-2,0];
    this.view[2] = [-3,0];
    this.view[3] = [-4,0];
  }

  //方向によって視界を替える(0:上,1:左,2:右,3:下)
  //キャラクターに今入ってる方向は古い
  //引数で受け取る「方向」がは新しい


  //初期の移動できる場所
  CharacterFierstMove(){//[X,Y]
    this.moveSpeed[0] = [-1,0];//上
    this.moveSpeed[1] = [0,-1];//左
    this.moveSpeed[2] = [0,1]; //右
    this.moveSpeed[3] = [1,0]; //下
  }
}
