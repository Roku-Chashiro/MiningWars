// モジュール
const Board = require( './Board.js' );

// ゲームクラス
// ・盤を保持する
// ・通信処理を有する Soket.io
// ・周期的処理を有する リアルタイム性は要らないからコレは要らない
module.exports = class Game {
    // 始動
    start( io ){
        // 変数
        const board = new Board( io ); // setInterval()内での参照があるので、スコープを抜けても、生存し続ける（ガーベッジコレクションされない）。
        //let「狭義なスコープ」
        let iTimeLast = Date.now(); // setInterval()内での参照があるので、スコープを抜けても、生存し続ける（ガーベッジコレクションされない）。

        // 接続時の処理
        // ・サーバーとクライアントの接続が確立すると、
        // 　サーバーで、'connection'イベント
        // 　クライアントで、'connect'イベントが発生する
        io.on(
            'connection',
            ( socket ) =>{
                console.log( 'connection : socket.id = %s', socket.id );//接続されたSocket.idをコンソールで確認

                // 切断時の処理の指定
                // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
                socket.on( 'disconnect',
                    () =>{
                        console.log( 'disconnect : socket.id = %s', socket.id );//切断されたSocket.idをコンソールで確認
                    } );
            } );
    }
}