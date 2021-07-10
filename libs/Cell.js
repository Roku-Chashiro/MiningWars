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
    RidOn;//上に何が乗っている場合にtrueなにもない場合false
    setCardNo;//埋まっているカードの枚数
    Card = [];//カードの空配列
    i;

    //コンストラクタ
    //カードの埋め込み
    //上に何かが乗っているかの判定
    constructor(){
        this.setCardNo = 3;
        //現在では取り敢えず空白のカードを3枚埋めているが
        //完成形では、ランダムで埋める
        for(this.i=0;this.setCardNo > this.i;this.i++){
          this.Card = new Card(1,0,0);
        }
        this.RidOn = false;
        console.log('RidOn=%s',this.RidOn);
    }
}
