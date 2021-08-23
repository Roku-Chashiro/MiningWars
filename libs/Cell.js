// モジュール
const Card = require( './Card.js' );
module.exports = class Cell{
    //埋まっているカードの枚数
    cardNo;
    //カードの空配列
    card = [];
    //カードの閲覧権限
    viewAuthority = [];
    //上に何か乗っている場合に乗っているオブジェクトなにもない場合null
    ridOn;

    //実体化1回目
    constructor(peopleNo){
        //閲覧権限を管理する
        this.viewAuthority = Array(peopleNo);
        for(var i=0;i < this.peopleNo;i++) this.viewAuthority[i] = false;
        this.cardNo = 3;
        //Math.floor(Math.random() * 最大値)　最小自動で0になる
        for(var i=0;i < this.cardNo;i++) this.card[i] = new Card(Math.floor(Math.random() * 0),i,Math.floor(Math.random() * 0));
        this.ridOn = null;
    }

    //再実体化
    constructor(cell){
        this.cardNo = cell.cardNo;
        for(let i=0;i < cell.card.length;i++) this.card[i] = new Card(cell.card[i]);
        this.viewAuthority = cell.viewAuthority;
        this.ridOn = cell.ridOn;
    }

    //何かが上に乗った場合の処理
    setRidOn(rider){
        this.ridOn = rider;
    }

    //乗っていた何かが退いた場合
    setRetire(){
        this.ridOn = null;
    }

    //閲覧解禁
    viewPermit(no){
        this.viewAuthority[no] = true;
    }
}
