//カードの名前と効果の在り処を呼び出すモジュール
const Character = require( './Character.js' );

//カードのクラス
module.exports = class Player{
    //キャラクターの最大体数を管理
    characterMaxNo;
    //キャラクターの生存人数
    characterLiveNo;
    //プレイヤーの動作順位
    actionRanking;
    //プレイ人数
    peopleNo;
    //キャラクターの格納場所
    characterList = [];
    //プレイヤーidを格納する
    playerId;
    //自分の順番かをbool型で判定する
    myOrder;

    constructor(actionRanking,peopleNo,playerId){
        this.actionRanking = actionRanking;
        this.peopleNo = peopleNo;
        this.playerId = playerId;
        this.characterMaxNo = 3;
        this.characterLiveNo = this.characterMaxNo;
        this.characterList = this.charcterCoordinate(this.actionRanking,this.peopleNo,this.characterMaxNo);
        this.myOrder = this.myTurnJuge(this.actionRanking);
    }

    //Boardからデータを受け取り、代入する為のコンストラクタ
    constructor(player){
        this.characterMaxNo = player.characterMaxNo;
        this.characterLiveNo = player.characterLiveNo;
        this.actionRanking = player.actionRanking;
        this.peopleNo = player.peopleNo;
        for(let i=0;i < this.characterList.length;i++) this.characterList[i] = new Character(player.characterList[i]);
        this.playerId = player.layerId;
        this.myOrder = player.myOrder;
    }

    //キャラクターの「visibilityRotation」に引き継ぐ変数
    intermediaryVisibilityRotation(direction,charNo){
        characterList[charNo].visibilityRotation(direction);
    }

    //自分の番か判定する
    myTurnJuge(actionRanking){
      return actionRanking == 0;
    }

    //キャラクターの初期位置をPlayerNoを基に作る
    charcterCoordinate(actionRanking,peopleNo,characterMaxNo){
        let flag;
        let coordinateList = [[[0,0],[0,1],[1,0]],
                              [[5,6],[6,5],[6,6]],
                              [[0,5],[0,6],[1,6]],
                              [[5,0],[6,0],[6,1]]];
        let characterList;
        if(actionRanking == 0) flag = 0;
        else if(actionRanking == 1 && peopleNo == 2
             || actionRanking == 2 && peopleNo == 4) flag = 1;
        else if(actionRanking == 1 && peopleNo == 4) flag = 2;
        else if(actionRanking == 3 && peopleNo == 4) flag = 3;
        for(let i=0;i < characterMaxNo;i++) characterList[i] = new Character(coordinateList[flag][i],actionRanking);
        return characterList;
    }
}