//カードの名前と効果の在り処を呼び出すモジュール
//const Blank = require( './cardEffect/Blank.js' );
const Damage = require( './cardEffect/Damage.js' );

//カードのクラス
module.exports = class Card{
    //カードの使用形式(永続,消耗)
    type;
    //カードのレアリティ(0:コモン,1:レア,2:エピック)
    rarity;
    //カードナンバー
    no;
    //カードの名前(文字列型)
    name;
    //カードの効果(処理)
    effect;
    //レアリティの文
    rarityString = ["C","R","E"];

    //実態化1回目
    constructor(type,rarity,no){
        this.materialization(type,rarity,no);
    }

    //再実体化
    constructor(card){
        this.materialization(card.type,card,card.rarity,card.no);
    }

    //実体化の実質的な処理を担うメソッド
    materialization(type,rarity,no){
        this.type = type;
        this.rarity = rarity;
        this.no = no;
        this.effect = this.seach(this.type,this.rarity,this.no);
    }

    //カードを探すための処理
    seach(type,rarity,no){
        //永続カードのサーチ
        if(type){
        //消耗カードのサーチ
        }else{
            if(no == 0) return new Damage(rarity);
        }
    }
}
