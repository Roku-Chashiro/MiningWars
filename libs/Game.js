// モジュール
const Board = require( './Board.js' );

//ゲームクラス
//盤を生成・保持する
//通信処理を有する Soket.io
module.exports = class Game {
    start(io){
        //フィールド
        //部屋
        let board = [];
        //接続中の全員のidを格納する
        let Lobby = [];

        //接続時の処理
        //サーバーとクライアントの接続が確立すると'connection'イベントが発生する
        //「on」で常にクライアントの「emit」を受け取る
        io.on('connection',function(socket){
            console.log( 'connection : socket.id = %s', socket.id );
            console.log('コネクション数',socket.client.conn.server.clientsCount);
            io.sockets.emit('count', socket.client.conn.server.clientsCount);

            //(接続数-1)の添字に接続されたクライアントのSocket.idを格納していく
            //接続が切れる度に添え字は順に詰める為(接続数-1)の添字は空きになるようにする
            Lobby[socket.client.conn.server.clientsCount-1] = socket.id;

            //対戦するプレイヤーを入った順でマッチさせる
            if(socket.client.conn.server.clientsCount > 0 && socket.client.conn.server.clientsCount%2 == 0){
                let roomNo = socket.client.conn.server.clientsCount/2;
                //接続数が2で割り切れる様になった場合に処理を開始する
                //新しい部屋を作成Lobbyの添字後ろ二人をマッチさせる。
                //既に対戦していたプレイヤーが相手が抜けて部屋に1人残った場合
                //IDの配列の添字が配列の一番後ろになるように'disconnect'で処理する
                board[roomNo] = new Board(Lobby[Lobby.length - 2],Lobby[Lobby.length - 1],roomNo);
                //それぞれのキーに部屋番号を入れて、それぞれの部屋の要素をBoardクラスで作り保存する
                console.log("ルーム%d:ゲーム開始",roomNo);
                io.emit("cellBlock".concat(roomNo),cellBlock = board[roomNo].cellSeting());
                io.emit("playerList".concat(roomNo),playerList = board[roomNo].playersMake());
            }

            //クライアントが切断したら、サーバー側で'disconnect'イベントが発生する
            socket.on('disconnect',function(data) {
                console.log( 'disconnect : socket.id = %s', socket.id);
                console.log('コネクション数',socket.client.conn.server.clientsCount);
                io.sockets.emit('count', socket.client.conn.server.clientsCount);
                //切断されたIDがどこの添字に有ったかを知る
                let Index = Lobby.indexOf(socket.id);
                let pairIndex;
                let lostRoomNo = Index/2;
                if(Index%2)pairIndex = Index - 1;
                else pairIndex = Index + 1;
                //配列の一番後ろに切断したクライアントの対戦相手のIDを代入する
                Lobby[Lobby.length+1] = Lobby[pairIndex];
                //接続の切れたクライアントと相手の元たった添字のidをnullにする
                Lobby = Lobby.filter(item => item.match(socket.id) == null);
                Lobby[pairIndex] = null;
                //nullを取り除いて、配列を綺麗に整える
                Lobby = Lobby.filter(Number.isFinite);
                //部屋の番号がズレるのでデータをソートする
                for(let i = lostRoomNo;i < (Lobby.length/2)-1;i++){
                    //データを上書きして消す
                    board[i] = board[i+1];
                    board[i].roomChange(i);
                    io.emit("cellBlock".concat(i),cellBlock = socket.on("cellBlock".concat(i+1),cellBlock));
                    io.emit("playerList".concat(i),playerList = socket.on("playerList".concat(i+1),playerList));
                }
                //一番最後の要素を削除して処理完了!!
                board.pop();
            });

            //部屋の喚び出しをされたら処理を始めるSocketの処理
            socket.on("roomNo",function(roomNo){
                //プレイヤーリストに変化があった場合の処理
                socket.on("playerList".concat(roomNo),function(playerList){
                    io.emit("cellBlock".concat(roomNo),cellBlock = board.playerToBoard(playerList));
                    io.emit("playerList".concat(roomNo),playerList);
                });
                //盤に変更があった場合
                socket.on("cellBlock".concat(roomNo),function(cellBlock){
                    io.emit("playerList".concat(roomNo),playerList = board.boardToPlayer(cellBlock));
                    io.emit("cellBlock".concat(roomNo),cellBlock);
                });
            });
        });
    }
}