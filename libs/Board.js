// 盤クラス
// ・ゲーム内の各種要素を保持する
// ・ゲームに保持される
// ・ゲームワールドの更新処理を有する（ゲームから要請を受け、保持する各種要素を更新する）
// ・ゲーム内の各種要素の生成、破棄を有する
// モジュール
const Cell = require('./Cell.js');
const Player = require('./Player.js');

//盤面のクラス
module.exports = class Board{
    //フィールドの準備(スコープ等細かい調節は後から行う)
    //キャメル記法を参考に命名する
    width;//横のマス数
    height;//縦のマス数
    cellBlock = [[]];
    peopleNo;//プレイ人数の格納
    PlayerList = [];//プレイヤーを人数分リスト化して格納する
    i;
    j;
    // コンストラクタ
    /*
     *ボードが作られるタイミングで
     Boolean viewPlayer配列で、どのプレイヤーがそのマスのアイテムを見れるか管理
    */
    constructor( io ){ //Game.jsから受け取ったSoket.io
        this.width = 7;
        this.height = 7;
        this.io = io;   // socketIOを自分のクラスで使えるようにする処理
        for(this.i=0;this.width > this.i;this.i++){
            for(this.j=0;this.height > this.j;this.j++){
                this.cellBlock[this.i[this.j]] = new Cell();
                console.log('i:=%d,j=%d',this.i,this.j);
            }
        }
        this.peopleNo = 2;//取り敢えず二人
        for(this.i = 0; this.i < this.peopleNo ;this.i++){
            this.PlayerList.push(new Player(this.i,this.peopleNo));
            //一先ず、プレイヤー番号0と1、人数を送って生成を試みる
        }
    }
}
