//カードの名前と効果の在り処を呼び出すモジュール
const Character = require( './Character.js' );

//カードのクラス
module.exports = class Player{

  //フィールドの準備(スコープ等細かい調節は後から行う)
  //キャメル記法を参考に命名する
  plyaerView = [];//Characterの視界を統合する
  turn = 3;//キャラクターの体数を管理
  live;
  count;
  playerNo;//プレイヤーの動作順位(先行,後攻)
  peopleNo;//プレイ人数
  characterList = [];//キャラクターの格納場所
  playerId;//プレイヤーidを格納する
  myOrder; //自分の順番かをbool型で判定する
  myNo;    //盤から見た自分の添字

  dummy;

  constructor(playerNo,peopleNo,playerId,myNo){
    this.playerNo = playerNo;//プレイヤーの識別番号
    this.peopleNo = peopleNo;//プレイヤーの人数
    this.playerId = playerId;
    this.charcterCoordinate();//キャラクターの開始座標を格納するメソッド
    //自分の番かを最初に判定する
    if(this.playerNo){
      this.myOrder = true;
    }else{
      this.myOrder = false;
    }
    this.myNo = myNo;
    this.live = this.turn;
    this.dummy =  function dummy(){
      console.log("dummy");
    }
  }

  //キャラクターの「visibilityRotation」に引き継ぐ変数
  /*intermediaryVisibilityRotation(direction,charNo){
    characterList[charNo].visibilityRotation(direction);
  }*/



  //キャラクターの初期位置をPlayerNoを基に作る
  charcterCoordinate(){
    if(this.playerNo == 1){//1番目のプレイヤー [Y,X]
      this.characterList[0] = new Character(/*0,0*/6,4,this.playerNo,0);
      this.characterList[1] = new Character(0,1,this.playerNo,1);
      this.characterList[2] = new Character(1,0,this.playerNo,2);
    } else if(this.playerNo == 0 && this.peopleNo == 2 //プレイヤー人数2人の時の二人目
           || this.PlayerNo == 2 && this.peopleNo == 4){//又は4人プレイの3人目の開始位置
      this.characterList[0] = new Character(/*5,6*/2,0,this.playerNo,0);
      this.characterList[1] = new Character(6,5,this.playerNo,1);
      this.characterList[2] = new Character(6,6,this.playerNo,2);
    } else if(this.playerNo == 1 && this.peopleNo == 4){//4人プレイの2人目のプレイヤーの開始位置
      this.characterList[0] = new Character(0,5,this.playerNo,0);
      this.characterList[1] = new Character(0,6,this.playerNo,1);
      this.characterList[2] = new Character(1,6,this.playerNo,2);
    } else if(this.PlayerNo == 3 && this.peopleNo == 4){//4人プレイの4人目の開始位置
      this.characterList[0] = new Character(5,0,this.playerNo,0);
      this.characterList[1] = new Character(6,0,this.playerNo,1);
      this.characterList[2] = new Character(6,1,this.playerNo,2);
    }
  }
}