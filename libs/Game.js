// モジュール
const Board = require( './Board.js' );

// ゲームクラス
// ・盤を生成・保持する
// ・通信処理を有する Soket.io
// ・周期的処理を有する リアルタイム性は要らないからコレは要らない
module.exports = class Game {
    start( io ){
        // 変数
        const board = new Board( io );
        //プレイヤーのSoke.idを格納する
        var playersId = [];
        //ゲームが開始すると呼び出す
        var game = new Game();

        //接続時の処理
        //サーバーとクライアントの接続が確立すると'connection'イベントが発生する
        //「on」で常にクライアントの「emit」を受け取る
        io.on('connection',function( socket ){
            //接続されたクライアントのSocket.idを確認
            console.log( 'connection : socket.id = %s', socket.id );
            //同時接続数を数える処理
            console.log('コネクション数',socket.client.conn.server.clientsCount);
            io.sockets.emit('count', socket.client.conn.server.clientsCount);

            //接続数-1の添字に接続されたクライアントのSocket.idを格納していく
            playersId[socket.client.conn.server.clientsCount-1]= socket.id;

            //Lobbyクラスを付くって、部屋を選択できるようにする処理を書く

            //ここで、コネクション数の分岐を書く
            if(socket.client.conn.server.clientsCount == 2){
                game.gameStart(playersId,board);
            }

            // 切断時の処理の指定
            // ・クライアントが切断したら、サーバー側で'disconnect'イベントが発生する
            socket.on( 'disconnect',function(data) {
                console.log( 'disconnect : socket.id = %s', socket.id );//切断されたSocket.idをコンソールで確認
                console.log('コネクション数',socket.client.conn.server.clientsCount);
                io.sockets.emit('count', socket.client.conn.server.clientsCount);
                //接続数が2以下になった瞬間呼び出して終了処理(3人アクセスから減っても機能しない欠陥有り)
                //接続を切った側のidを検出し配列から削除する
                if(socket.client.conn.server.clientsCount <= 2){
                    playersId = playersId.filter(item => item.match(socket.id) == null);
                    game.gameEnd(playersId,board);
                }
            });

            //プレイヤーリストに変化があった場合の処理
            socket.on("playerList",function(playerList) {
                var cellBlock = board.playerToBoard(playerList);
                io.emit("cellBlock",cellBlock);
                io.emit("playerList",playerList);

            });

            //盤に変更があった場合
            socket.on("cellBlock",function(cellBlock){
                var playerList = board.boardToPlayer(cellBlock);
                io.emit("cellBlock",cellBlock);
                io.emit("playerList",playerList);
            });
        });
    }

    //ゲーム開始
    gameStart(playersId,board){
        console.log("ゲーム開始");
        board.setPlayersId(playersId);
        board.GameMaster();
    }
    //ゲーム終了
    gameEnd(PlayersId,board){
        console.log("ゲーム終了");
        board.setPlayersId(PlayersId);
    }
}