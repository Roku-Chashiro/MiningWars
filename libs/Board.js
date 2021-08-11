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
    playersId;
    cellBlock;
    playerList;
    io;

    //コンストラクタ
    //ボードが作られるタイミングでいSoket.ioを引続
    constructor( io ){  //Game.jsから受け取ったSoket.io
        this.io = io;   // socketIOを自分のクラスで使えるようにする処理
    }

    //Gameクラスから送られるプレイヤーidの取得
    //誰と誰が戦うのかがわかる
    setPlayersId(playersId){
        this.playersId = playersId;
    }

    //盤のマス(Cell)をセットする関数
    cellSeting(){
        var edge = 7;//マスの1辺の量
        this.cellBlock = new Array(edge); //Y列生成
        for(var i=0;i < this.cellBlock.length;i++){
            this.cellBlock[i] = new Array(edge);    //X列生成
            for(var j=0;j < this.cellBlock[i].length;j++){
                //[Y][X]で生成
                this.cellBlock[i][j] = new Cell(this.playersId.length);
            }
        }
    }

    //プレイヤーの作成
    //先行後攻を決める
    playersMake(){
        var playerNo = new Array(this.playersId.length);
        this.playerList = new Array(this.playersId.length);//プレイヤーを人数分リスト化
        //初期化
        for(var i = 0; i < playerNo.length ;i++) playerNo[i] = 0;//後攻
        playerNo[Math.floor(Math.random()*((1+1)-0))/1] = 1;     //先行
        //プレイヤーを生成して、リストに格納する
        for(var i = 0; i < this.playerList.length ;i++){
            this.playerList[i] = new Player(playerNo[i],this.playersId.length,this.playersId[i],i);
            console.log("リスト確認",this.playerList[i]);
            console.log("作った直後",this.playerList[i].dummy());
            console.log("作った直後",this.playerList[i].dummy);
            console.log("作った直後",this.playerList[i].dummy.name);
            //プレイヤーの中でキャラが生成されるため、盤にキャラが乗っている判定を盤にする
            for(var j=0;j < this.playerList[i].turn;j++){
                this.cellBlock[this.playerList[i].characterList[j].coordinate[0]][this.playerList[i].characterList[j].coordinate[1]].setRidOn(this.playerList[i].characterList[j]);
            }
        }
    }

    //ゲームの用意をする
   　GameMaster(){
        this.cellSeting();
        this.playersMake();
        //ここまでで、生成した[マス][プレイヤー,キャラクター]のデータを送る
        this.io.emit("cellBlock",this.cellBlock);
        this.io.emit("playerList",this.playerList);
    }

    //盤からキャラクターの情報を抽出してplayerListに反映させる
    boardToPlayer(cellBlock){
        this.cellBlock = cellBlock;
        //盤のY軸
        for(var i=0;i < this.cellBlock.length;i++){
            //盤のX軸
            for(var j=0;j < this.cellBlock[i].length;j++){
                //[X][Y]に何か乗っている場合
                if(this.cellBlock[i][j].ridOn != null){
                    //どのプレイヤーのキャラクターか判別(2人か4人プレイで変わるので、もう一個for文を使って汎用性を増やすべき)
                    if(this.playerList[0].playerNo == this.cellBlock[i][j].ridOn.playerNo){
                        this.playerList[0].characterList[this.cellBlock[i][j].ridOn.myNo] = this.cellBlock[i][j].ridOn;
                        this.playerList[0].characterList[this.cellBlock[i][j].ridOn.myNo].coordinate = [i,j];
                    } else {
                        this.playerList[1].characterList[this.cellBlock[i][j].ridOn.myNo] = this.cellBlock[i][j].ridOn;
                        this.playerList[1].characterList[this.cellBlock[i][j].ridOn.myNo].coordinate = [i,j];
                    }
                }
            }
        }
        return this.playerList;
    }

    //プレイヤーリストを基に盤に反映させる
    playerToBoard(players){
        //盤に乗っている状態"だけ"を一度リセット
        //盤のY軸
        for(var i=0;i < this.cellBlock.length;i++){
            //盤のX軸
            for(var j=0;j < this.cellBlock[i].length;j++){
                if(this.cellBlock[i][j].ridOn != null){
                    this.cellBlock[i][j].ridOn = null;
                }
            }
        }
        //キャラクターを再配置
        for(var i=0;i < players.length;i++){
            for(var j=0;j < players[i].turn;j++){
                //視界の再配置
                //一度(0:上)に戻す
                var viewCopy = players[i].characterList[j].view;
                if(this.playerList[i].characterList[j].direction == 1){
                    //左から上
                    for(var k=0;k < viewCopy.length;k++){
                        players[i].characterList[j].view[k] = [viewCopy[k][1],viewCopy[k][0]];
                    }
                } else if(this.playerList[i].characterList[j].direction == 2){
                    //右から上
                    for(var k=0;k < viewCopy.length;k++){
                        players[i].characterList[j].view[k] = [-(viewCopy[k][1]),viewCopy[k][0]];
                    }
                } else if(this.playerList[i].characterList[j].direction == 3){
                    //下から上
                    for(var k=0;k < viewCopy.length;k++){
                        players[i].characterList[j].view[k] = [-(viewCopy[k][0]),viewCopy[k][1]];
                    }
                }
                //再度代入
                viewCopy = players[i].characterList[j].view;
                //新しい方の方向と比較して視界変更
                if(players[i].characterList[j].direction == 1){
                    for(var k=0;k < players[i].characterList[j].view.length;k++){
                        players[i].characterList[j].view[k] = [viewCopy[k][1],viewCopy[k][0]];
                    }
                } else if(players[i].characterList[j].direction == 2){
                    for(var k=0;k < players[i].characterList[j].view.length;k++){
                        players[i].characterList[j].view[k] = [viewCopy[k][1],-(viewCopy[k][0])];
                    }
                } else if(players[i].characterList[j].direction == 3){
                    for(var k=0;k < players[i].characterList[j].view.length;k++){
                        players[i].characterList[j].view[k] = [-(viewCopy[k][0]),viewCopy[k][1]];
                    }
                }
                this.cellBlock[players[i].characterList[j].coordinate[0]][players[i].characterList[j].coordinate[1]].ridOn = players[i].characterList[j];
            }
        }
        /*Socket.io後は関数を入れた変数は使えない
        console.log("なんか色々後",this.playerList[i]);
        console.log("なんか色々後",this.playerList[i].dummy(2,3));
        console.log("なんか色々後",this.playerList[i].dummy);
        console.log("なんか色々後",this.playerList[i].dummy.name);*/
        //新旧データを比較する処理があるので、代入は最後
        this.playerList = players;
        return this.cellBlock;
    }


}
