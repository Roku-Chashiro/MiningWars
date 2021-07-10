//カードの名前と効果の在り処を呼び出すモジュール
const Card= require( './Card.js');
//カードの名前と効果の在り処を呼び出すモジュール
module.exports = class Character{

    //フィールドの準備(スコープ等細かい調節は後から行う)
    //キャメル記法を参考に命名する
    maxHP;            //最大体力
    currentHP;      //現在の体力
    view = [];        //視野、フィルタ用に配列を入れる
    sMovSpeed;     //標準の移動速度
    addMovSpeed;//追加の速度
    pocket = [];       //持ち物
    poketSize;//持ち物が持てる個数を表す
    coordinate = [];//座標
    belongs;           //所属先のプレイヤーのNoを格納する
    mines;             //採掘回数の格納
    direction;//向いている方向を格納する(0:上,1:左,2:右,3:下)
    i;//インデックス

    //コンストラクタ
    //座標と所属先のプレイヤーNoを送られて生成する
    constructor(X,Y,playerNo){
        this.coordinate[0] = X;//座標の格納
        this.coordinate[1] = Y;//座標の格納
        this.belongs = playerNo; //所属先の格納
        this.maxHP = 100;
        this.currentHP = this.maxHP;
        this.characterFiestView();
        this.sMovSpeed = 2;
        this.addMovSpeed = 0;
        this.poketSize = 3;
        for(this.i=0;this.i < this.poketSize;this.i++){
          this.pocket[this.i] = (new Card(1,0,0));//空白のカードを入れる;
        }
        this.mines = 0;
        this.direction = 0;//初期状態ではどのキャラも画面上を向く
        console.log('PlayerNo=%d,X=%d,Y=%d',playerNo,this.coordinate[0],this.coordinate[1]);
    }

    //初期のキャラクターの視界
    characterFiestView(){
      this.view[0] = [0,-1];//上
      this.view[1] = [-1,0];//左
      this.view[2] = [1,0];//右
      this.view[3] = [0,1];//後
    }
}
