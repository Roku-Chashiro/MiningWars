// スクリーンクラス
class Screen{
    // コンストラクタ
    constructor( socket, canvas ){
        this.socket = socket;
        this.canvas = canvas;
        // 二次元グラフィックスのコンテキストを取得が'2d'
        this.context = canvas.getContext( '2d' ); //Canvas.getContext() - キャンパスに描画するコンテキストを取得

        //Assetsをモジュールとして入れていないが、Assetsを実体化してるAssetsをモジュールとして入れていないが、Assetsを実体化してる
        this.assets = new Assets();
        this.iProcessingTimeNanoSec = 0;//???

        // キャンバスの初期化
        this.canvas.width = SharedSettings.FIELD_WIDTH;
        this.canvas.height = SharedSettings.FIELD_HEIGHT;

        // ソケットの初期化
        this.initSocket();

        // コンテキストの初期化
        // アンチエイリアスの抑止（画像がぼやけるのの防止）以下４行
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
    }

    // ソケットの初期化
    initSocket(){
        // 接続確立時の処理
        // ・サーバーとクライアントの接続が確立すると、
        // 　サーバーで、'connection'イベント
        // 　クライアントで、'connect'イベントが発生する
        this.socket.on(
            'connect',
            () =>{
                console.log( 'connect : socket.id = %s', socket.id );
                // サーバーのsoketのデータに'enter-the-game'を送信
                this.socket.emit( 'enter-the-game' );
            } );

        // サーバーからの状態通知に対する処理
        // ・サーバー側の周期的処理の「io.sockets.emit( 'update', ・・・ );」に対する処理
        this.socket.on(
            'update',
            ( iProcessingTimeNanoSec ) =>{
                this.iProcessingTimeNanoSec = iProcessingTimeNanoSec;
            } );
    }

    // アニメーション（無限ループ処理）
    //???
    animate( iTimeCurrent ){
        requestAnimationFrame(
            ( iTimeCurrent ) =>{
                this.animate( iTimeCurrent );
            } );
        console.log( 'animate' );
        this.render( iTimeCurrent );
    }

    // 描画。animateから無限に呼び出される
    render( iTimeCurrent ){
        console.log( 'render' );

        // キャンバスのクリア
        this.context.clearRect( 0, 0, canvas.width, canvas.height );

        // 背景の書き直し
        this.renderField();

        // キャンバスの枠の描画
        this.context.save();//描画設定の保存をする場合はsaveメソッドを利用します。
        this.context.strokeStyle = RenderingSettings.FIELD_LINECOLOR;
        this.context.lineWidth = RenderingSettings.FIELD_LINEWIDTH;
        this.context.strokeRect( 0, 0, canvas.width, canvas.height );
        this.context.restore();

        // 画面右上にサーバー処理時間表示
        //this.context.save();
        //this.context.font = RenderingSettings.PROCESSINGTIME_FONT;
        //this.context.fillStyle = RenderingSettings.PROCESSINGTIME_COLOR;
        //this.context.fillText( ( this.iProcessingTimeNanoSec * 1e-9 ).toFixed( 9 ) + ' [s]',
            //this.canvas.width - 30 * 10,
            //40 );
        //this.context.restore();
    }

    //背景を書き直すメソッド
    renderField(){
        this.context.save();

        let iCountX = parseInt( SharedSettings.FIELD_WIDTH / RenderingSettings.FIELDTILE_WIDTH );//割ると定数になるように設定してる
        let iCountY = parseInt( SharedSettings.FIELD_HEIGHT / RenderingSettings.FIELDTILE_HEIGHT );//割ると定数になるように設定してる
        for( let iIndexY = 0; iIndexY < iCountY; iIndexY++ ){//2回
            for( let iIndexX = 0; iIndexX < iCountX; iIndexX++ ){//2回
                this.context.drawImage( this.assets.imageField,//イメージを使う
                    this.assets.rectFieldInFieldImage.sx, this.assets.rectFieldInFieldImage.sy,	// 描画元画像の右上座標
                    this.assets.rectFieldInFieldImage.sw, this.assets.rectFieldInFieldImage.sh,	// 描画元画像の大きさ
                    iIndexX * RenderingSettings.FIELDTILE_WIDTH,//画像を並べる時、左上から順になるように座標指定してる
                    iIndexY * RenderingSettings.FIELDTILE_HEIGHT,
                    RenderingSettings.FIELDTILE_WIDTH,	// 描画基の画像のの大きさ
                    RenderingSettings.FIELDTILE_HEIGHT );//描画基の画像のの大きさ
            }
        }

        this.context.restore();
    }
}
