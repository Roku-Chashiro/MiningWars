//カードの名前と効果の在り処を呼び出すモジュール
const Character = require( './Character.js' );

//カードのクラス
module.exports = class Player{

    //フィールドの準備(スコープ等細かい調節は後から行う)
    //キャメル記法を参考に命名する
    plyaerView = [[]];//Characterの視界を統合するリスト
    turn;//開始時のキャラクターの体数
    playerNo;//Board.jsからランダムで決められる
    peopleNo;//プレイ人数
    characterList;//キャラクターの格納場所
    characterXY = [[]];//キャラクターの初期位置を格納するリスト
    i;

    constructor(playerNo,peopleNo){
      this.playerNo = playerNo;//プレイヤーの識別番号
      this.peopleNo = peopleNo;//プレイヤーの人数
      this.charcterCoordinate();//キャラクターの開始座標を格納するメソッド
      //キャラクターを3体分生成します
      this.turn = 3;
      for(this.i=0; this.i < this.turn;this.i++){
        this.characterList = new Character(this.characterXY[this.i][0],this.characterXY[this.i][1],this.playerNo);
      }
    }

    //キャラクターの初期位置をPlayerNoを基に作る
    charcterCoordinate(){
      if(this.playerNo == 0){
        this.characterXY[0] = [0,0];
        this.characterXY[1] = [0,1];
        this.characterXY[2] = [1,0];
        console.log('プレイヤー番号',this.playerNo); 
        console.log('配列の長さ',this.characterXY.length);
        console.log('配列の長さ',this.characterXY[0].length);
        console.log('characterXY[0]',this.characterXY[0]);
        console.log('characterXY[1]',this.characterXY[1]);
        console.log('characterXY[2]',this.characterXY[2]);
        console.log('座標[0]の:XY=(%d:%d)',this.characterXY[0][0],this.characterXY[0][1]);
        console.log('座標[1]の:XY=(%d:%d)',this.characterXY[1][0],this.characterXY[1][1]);
        console.log('座標[2]の:XY=(%d:%d)',this.characterXY[2][0],this.characterXY[2][1]);
      } else if(this.playerNo == 1 && this.peopleNo == 2 //プレイヤー人数2人の時の二人目
             || this.PlayerNo == 2 && this.peopleNo == 4){//又は4人プレイの3人目の開始位置
        this.characterXY[0] = [6,5];
        this.characterXY[1] = [5,6];
        this.characterXY[2] = [6,6];
        console.log('プレイヤー番号',this.playerNo); 
        console.log('配列の長さ',this.characterXY.length);
        console.log('配列の長さ',this.characterXY[0].length);
        console.log('characterXY[0]',this.characterXY[0]);
        console.log('characterXY[1]',this.characterXY[1]);
        console.log('characterXY[2]',this.characterXY[2]);
        console.log('座標[0]の:XY=(%d:%d)',this.characterXY[0][0],this.characterXY[0][1]);
        console.log('座標[1]の:XY=(%d:%d)',this.characterXY[1][0],this.characterXY[1][1]);
        console.log('座標[2]の:XY=(%d:%d)',this.characterXY[2][0],this.characterXY[2][1]);

      } else if(this.playerNo == 1 && this.peopleNo == 4){//4人プレイの2人目のプレイヤーの開始位置
        this.characterXY = [5,0];
        this.characterXY = [6,0];
        this.characterXY = [6,1];
      } else if(this.PlayerNo == 3 && this.peopleNo == 4){
        this.characterXY = [0,5];//.push([0,5]);
        this.characterXY = [0,6];//.push([0,6]);
        this.characterXY = [1,6];//.push([1,6]);
      }
      return this.characterXY;
    }
}
