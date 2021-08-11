//「ダメージカード」の効果を表記
module.exports = class Blank{
    //空白カードのクラス
    //フィールドの準備
    
    //カードの種類
    //レアリティ
    //範囲
    //ダメージ

    //レアリティの文
    rarityString = ["C","R","E"];

    nameReturn(rarity){
        return "ダメージカード:" + (rarity+1) * 20 + "ダメージ";
    }

    dirReturn(rarity){
        return "card/damage" + this.rarityString[rarity] + ".jpg"
    }
}