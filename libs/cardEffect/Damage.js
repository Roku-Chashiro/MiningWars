//「ダメージカード」の効果を表記
module.exports = class Blank{
    //カードの種類
    type;
    //レアリティ
    rarity;
    //範囲
    range;
    //ダメージ量
    damage;
    //効果対象
    effectTerget;

    //最初の実体化
     constructor(rarity){
        this.materialization(rarity)
    }

    //再実体化
    constructor(damage){
        this.materialization(damage.rarity)
        this.range = damage.range;
    }

    //実質的な実体化処理
    //実体化の実質的な処理を担うメソッド
    materialization(rarity){
        this.type = 1;
        this.effectTerget = 1;
        this.rarity = rarity;
        this.range = this.caedFiestScope();
        this.damage = 20 * rarity;
    }

    nameReturn(rarity){
        return "ダメージカード" + this.rarityString[rarity] + ":" + (rarity+1) * 20 + "ダメージ";
    }

    dirReturn(rarity){
        return "card/damage" + this.rarityString[rarity] + ".jpg"
    }

    //キャラクターの向いている方向に攻撃範囲を合わせる
    //誰のどのキャラクターが
    //どの位置から、どの方向に
    //他のカードがどの様な影響を及ぼしたかを判断して

    //キャラの位置、方向、カードの範囲かから効果を及ぼす座標をリスト化する
    //renge = caedFiestScope();で送る
    //filterRotation CharacterクラスのfilterRotationメソッドを想定
    effectRange(){
        return function(coordinate,direction,filterRotation,renge,OffBoardJuge,edge){
            let rengeList = filterRotation(direction,0,renge);
            for(let i=0;i < rengeList.length;i++) {
                rengeList[i] = [rengeList[i][0] + coordinate[0],rengeList[i][1] + coordinate[1]];
                if(OffBoardJuge(rengeList[i],edge)) rengeList[i] = null;
            }
            return rengeList = rengeList.filter(Number.isFinite);
        }
    }

    //効果対象
    effectAffect(){
        return function(cellBlock,rengeList,effectTerget,effectContent,actionRanking){
            const cellPoint = (i) => cellBlock[rengeList[i][0]][rengeList[i][1]];
            //標準は両方に効く
            let flag = 3;
            for(let i=0;i < rengeList.length;i++){
                if(cellPoint != null){
                    if(effectTerget == 3) cellPoint = effectContent(cellPoint.ridOn);
                    else {
                        //0なら味方、1なら敵
                        if(cellPoint.ridOn.actionRanking == actionRanking) flag = 0;
                        else flag = 1;
                    }
                }
                if(effectTerget == flag) cellPoint = effectContent(cellPoint.ridOn);
            }
            return cellBlock;
        }
    }

    //ダメージの効果内容
    effectContent(character,damage){
        return function(){
            return character.currentHP = character.currentHP - damage;
        }
    }

    //カードの有効範囲(画面上を向いた状態が基準)
    caedFiestScope(){
        return [[-1,0]];
    }
}