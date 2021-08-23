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
    playersId = [];
    cellBlock;
    playerList;
    //Socket.ioの関係上、メソッドの情報が消えるためメソッドを保持するクラスが要る
    roomNo;

    //コンストラクタ
    constructor(playerOne,playertwo,roomNo){
        this.playersId[0] = playerOne;
        this.playersId[1] = playertwo;
        this.roomNo = roomNo;
    }

    //Gameクラス側で部屋番号の変更が有る
    roomchange(roomNo){
        this.roomNo = roomNo;
    }

    //盤のマス(Cell)をセットするメソッド
    cellSeting(){
        //盤の1辺のマス目の量
        let edge = 7;
        //Y列生成
        this.cellBlock = new Array(edge);
        for(let i=0;i < this.cellBlock.length;i++){
            //X行生成
            this.cellBlock[i] = new Array(edge);
            for(let j=0;j < this.cellBlock[i].length;j++){
                //[Y][X]で生成
                this.cellBlock[i][j] = new Cell(this.playersId.length);
            }
        }
        return this.cellBlock;
    }

    //プレイヤーの作成
    //先行後攻を決める
    playersMake(){
        this.playerList = new Array(this.playersId.length);//プレイヤーを人数分リスト化
        //初期化
        //プレイヤーの行動の順番を決める処理
        //IDを並び替えて、早い順に並び替える
        let orderPlayerId = [];
        let randomNo;
        for(let i = 0; i < playerList.length ;i++){
            randomNo = Math.floor(Math.random() * this.playersId.length);
            orderPlayerId[i] = playerId[randomNo];
            this.playersId.splice(randomNo,1)
        }
        this.playerId = orderPlayerId;
        //プレイヤーを生成して、リストに格納する
        const getCharactersCoordinate = (i, j) => this.playerList[i].characterList[j];
        for(let i = 0; i < this.playerList.length ;i++){
            this.playerList[i] = new Player(i,this.playersId.length,this.playersId[i]);
            //プレイヤーの中でキャラが生成されるため、盤にキャラが乗っている判定を盤にする
            for(let j=0;j < this.playerList[i].turn;j++){
                this.cellBlock[getCharactersCoordinate.coordinate[0]][getCharactersCoordinate.coordinate[1]].setRidOn(this.playerList[i].characterList[j]);
            }
        }
        return this.playerList;
    }

    //盤からキャラクターの情報を抽出してplayerListに反映させる
    boardToPlayer(cellBlock){
        this.cellBlock = cellBlock;
        for(var i=0;i < this.cellBlock.length;i++){
            for(var j=0;j < this.cellBlock[i].length;j++){
                //[X][Y]に何か乗っている場合
                if(this.cellBlock[i][j].ridOn != null){
                    for(let k=0;k < this.playerList.length;k++){
                        if(k == cellBlock[i][j].ridOn.playerNo) this.playerList[k].characterList[this.cellBlock[i][j].ridOn.myNo] = this.cellBlock[i][j].ridOn;
                            //ちゃんと代入された状態で受信して欲しいから削除
                            //this.playerList[k].characterList[this.cellBlock[i][j].ridOn.myNo].coordinate = [i,j];
                        //}
                    }
                }
            }
        }
        return this.playerList;
    }

    //プレイヤーリストを基に盤に反映させる
    playerToBoard(players){
        //盤に乗っている状態"だけ"を一度リセット
        for(var i=0;i < this.cellBlock.length;i++){
            for(var j=0;j < this.cellBlock[i].length;j++){
                if(this.cellBlock[i][j].ridOn != null){
                    this.cellBlock[i][j].ridOn = null;
                }
            }
        }
        //各プレイヤーのキャラクターを再配置
        for(var i=0;i < players.length;i++){
            //各プレイヤーの変更点を処理する(関数を使えるようにするため)
            this.playerList[i] = new Player(this.playerList[i]);
            //盤に再度並べる処理
            for(var j=0;j < players[i].turn;j++){
                this.cellBlock[players[i].characterList[j].coordinate[0]][players[i].characterList[j].coordinate[1]].ridOn = players[i].characterList[j];
            }
        }
        this.playerList = players;
        return this.cellBlock;
    }

    //盤外判定を行う関数を返すメソッド
    OffBoardJuge(){
        return function(coordinate,edge){
            for(let i=0;i < coordinate.length;i++){
                if(coordinate[i] < 0 && coordinate[i] > edge) return true;
            }
        }
    }
}