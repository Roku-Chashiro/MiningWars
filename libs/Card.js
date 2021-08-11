//カードの名前と効果の在り処を呼び出すモジュール
const Blank = require( './cardEffect/Blank.js' );

//カードのクラス
module.exports = class Card{

    //フィールドの準備(スコープ等細かい調節は後から行う)
    //キャメル記法を参考に命名する

    type;//カードの使用形式(永続,消耗)
    rarity;//カードのレアリティ(コモン,レア,エピック)
    no;//カードナンバー
    name;//カードの名前(文字列型)
    effect;//カードの効果(処理)
    cardImgDir;//カードの画像の場所を表示

    //コンストラクタ
    //引数(形式,レアリティ,ナンバー)
    constructor(type,rarity,no){
        this.type = type;
        this.rarity = rarity;
        this.no = no;
        this.effect = this.seach(this.type,this.rarity,this.no);
        this.name = this.effect.nameReturn();
        this.cardImgDir = this.effect.dirReturn();
        //console.log( 'Cardname : = %s', this.name );
    }

    //カードを探すための処理
    seach(type,rarity,no){
        //消耗カードのサーチ
        if(type){//typeが1の時実行されるので消耗カード
            if(no === 0 && rarity == 0) return new Blank();//ブランクカード"X===Y"厳密に比較
        //永続カードのサーチ
        }else{
        }
    }
}
