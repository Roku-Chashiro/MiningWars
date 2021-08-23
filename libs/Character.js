module.exports = class Character{
    //最大体力
    maxHP;
    //現在の体力
    currentHP;
    //視野、フィルタ用に配列を入れる
    viewFilter = [];
    //移動可能なマス
    moveFilter = [];
    //持ち物が持てる個数を表す
    pocketSize;
    //持ち物
    pocket = [];
    //座標[Y,X]
    coordinate = [];
    //所属先のプレイヤーの行動順番
    actionRanking;
    //採掘回数の格納
    miningNo;
    //向いている方向(0:上,1:左,2:右,3:下)
    direction;

    //一度目の実体化
    constructor(coordinate,actionRanking){
        this.coordinate = coordinate;
        this.actionRanking = actionRanking;
        this.maxHP = 100;
        this.currentHP = this.maxHP;
        this.pocketSize = 3;
        this.viewFilter = this.characterFiestView();
        this.moveFilter = this.characterFierstMove();
        this.pocket;
        this.miningNo = 0;
        this.direction = 0;
    }

    //再実体化
    constructor(character){
        this.maxHP = character.maxHP;
        this.currentHP = character.currentHP;
        this.viewFilter = character.viewFilter;
        this.moveFilter = character.moveFilter;
        this.pocketSize = character.pocketSize;
        this.pocket = character.pocket;
        this.coordinate = character.coordinate;
        this.actionRanking = character.actionRanking;
        this.miningNo = character.miningNo;
        this.direction = character.direction;
    }

    //向いている方向に「視界」や「移動範囲」のフィルターをあわせる
    filterRotation(){
        return function(newDirection,oldDirection,filter){
            //[左右入れ替えの有無(0=そのまま,1=入れ替え),配列のYに掛ける処理,配列の,Xに掛ける処理]
            let rotationFilter = [[[0, 1, 1],[1, 1, 1],[1,-1, 1],[0,-1, 1]],
                                  [[0, 1, 1],[1, 1, 1],[1, 1,-1],[0,-1, 1]]];
            for(let i=0;i < filter.length;i++){
                //一度画面上を向け引数を元基に向き直す
                filter[i] = [filter[i][rotationFilter[0][oldDirection][0]] * rotationFilter[0][oldDirection][0] ,filter[i][rotationFilter[0][oldDirection][0]^1] * rotationFilter[0][oldDirection][1]];
                filter[i] = [filter[i][rotationFilter[0][newDirection][0]] * rotationFilter[0][newDirection][0] ,filter[i][rotationFilter[0][newDirection][0]^1] * rotationFilter[0][newDirection][1]];
            }
            return filter;
        }
    }

    //初期の見える範囲
    characterFiestView(){
        //return [[-1,0],[0,-1],[0,1],[1,0]];
        //試用視界
        return [[-1,0],[-2,0],[-3,0],[-4,0]];
    }

    //初期の移動できる範囲
    characterFierstMove(){
        return [[-1,0],[0,-1],[0,1],[1,0]];
    }
}
