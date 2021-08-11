//Cellクラス
//盤面の1マス分の処理とデータ
// モジュール
const Card = require( './Card.js' );

//1マスのクラス
module.exports = class Cell{
    //[1マス分の処理]
    //カード3枚を配列に入れる処理(ランダム)
    //RidOnに最初は全マスfalseを入れる

    //フィールドの準備(スコープ等細かい調節は後から行う)
    //キャメル記法を参考に命名する
    ridOn;//上に何が乗っている場合にtrueなにもない場合false
    setCardNo;//埋まっているカードの枚数
    Card = [];//カードの空配列
    viewAuthority = [];//カードの閲覧権限

    //コンストラクタ
    //カードの埋め込み
    //上に何かが乗っているかの判定
    constructor(peopleNo){ //人数を受け取り
        this.setCardNo = 3;
        this.viewAuthority = Array(peopleNo); //人数分の長さ
        for(var i=0;i < this.viewAuthority.length;i++){
          this.viewAuthority[i] = false;
        }
        //現在では取り敢えず空白のカードを3枚埋めているが
        //完成形では、ランダムで埋める
        for(var i=0;i < this.setCardNo;i++){
          this.Card[i] = new Card(1,0,0);
        }
        this.ridOn = null;
    }

    //何かが上に乗った場合の処理
    setRidOn(rider){
      this.ridOn = rider;
    }

    //乗っていた何かが退いた場合
    setRetire(){
      this.ridOn = null;
    }

    //閲覧許可
    viewPermit(no){
      this.viewAuthority[i] = true;
    }

    //オブジェクトの名前を返す
    getName(){
      return 'Cell';
    }
}
