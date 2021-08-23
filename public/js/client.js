'use strict';	// 厳格モード

// モジュールを使えるようにする(ioどっから来た？)
const socket = io.connect();	// クライアントからサーバーへの接続要求
// キャンバスオブジェクト
const screen = new Screen(socket);

// ページがunloadされる時（閉じる時、再読み込み時、別ページへ移動時）は、通信を切断する
$( window ).on('beforeunload',( event )=>{
    socket.disconnect();
});
