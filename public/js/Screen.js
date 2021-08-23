//カードの名前と効果の在り処を呼び出すモジュール
// スクリーンクラス
class Screen{
    //フィールド
    boardAppearance;    //HTMLの盤のelementを格納する変数
    cardAppearance;     //HTMLのカードのelementを格納する変数[3,2]
    textAppearance;     //HTMLのtextのelementを格納する
    miningAppearance;   //HTMLの採掘のelementを格納する
    moveAppearance;     //HTMLの移動のelementを格納する
    directionAppearance;//HTMLの方向のelementを格納する
    endAppearance;      //HTMLの終了のelementを格納する
    playerList;         //プレイヤーとキャラクター
    cellBlock;          //盤
    coordinate;         //クリックした座標を格納する変数[Y,X]
    characterHold;      //一度行動したキャラクターを束縛する変数,[終了]を押すまで行動したキャラの添字を格納する。標準はnull;
    actionHold;         //行動を選択した後、もう一度ボタンを押す場合に行動を束縛する変数
    myIndex;            //playerListの何処に、このクライアントのデータがあるかを示す添字
    count = 0;          //自分が行動した回数を数える
    chara;              //キャラクター
    directionImg;       //方角
    enemy;              //敵
    jpg;                //拡張子jpg
    imgeDir;            //イメージのディレクトリを示す
    socket;             //このクライアントのidを保存する
    oneTimeCheck;       //開始時一度だけ行う処理(データが来てから)を複数回しない為の処理
    remainingDirection; //方角の値を保存

    //コンストラクタ
    constructor(socket){
        this.socket = socket;
        //盤の要素をidで取得する
        this.boardAppearance = new Array(7);
        for(let i=0;i < this.boardAppearance.length;i++){ //Y軸
            this.boardAppearance[i] = new Array(7);
            for(let j=0;j < this.boardAppearance[i].length;j++){ //X軸 [Y,X]
                this.boardAppearance[i][j] =  document.getElementById(String('board' + i + j));
            }
        }
        //カードを表示するボタン要素をidで取得する
        //カードは左3つが00,01,02,右3つが10,11,12
        this.cardAppearance = new Array(2);
        for(let i=0;i < this.cardAppearance.length;i++){
            this.cardAppearance[i] = new Array(3);
            for(let j=0;j <this.cardAppearance[i].length;j++){
                this.cardAppearance[i][j] = document.getElementById(String('card' + i + j));
            }
        }
        //テキストの要素をidで取得する
        this.textAppearance = document.getElementById('text');
        //操作ボタン系の要素をidで取得する
        this.miningAppearance    = document.getElementById('mining');
        this.moveAppearance      = document.getElementById('move');
        this.directionAppearance = document.getElementById('direction');
        this.endAppearance       = document.getElementById('end');

        //画像を呼び出す為に使う文字列を格納していく
        //キャラクター
        this.chara = "Chara";
        //画像のディレクトリを示す
        this.imgeDir ="../images/";
        //キャラクターがどの方向を向いているかの画像を用意する配列
        this.directionImg = new Array(4);
        this.directionImg[0] = 'North';//上
        this.directionImg[1] = 'West'; //左
        this.directionImg[2] = 'East'; //右
        this.directionImg[3] = 'South';//下
        //敵の場合、方向の後につける文字列
        this.enemy = "Enemy";
        //画像形式
        this.jpg = ".jpg";

        //oneTimeの制御
        this.oneTimeCheck = true;

        //プレイヤーの情報をサーバから受け取り
        this.socket.on("playerList",(playerList) =>{
            this.playerList = playerList;
            console.log("受信:playerList:",this.playerList);
            //データを受け取ってから一度だけ呼び出す関数
            if(this.oneTimeCheck) this.oneTime();
            this.renderMain();
        });
        //盤の情報をサーバから受け取り
        this.socket.on("cellBlock",(cellBlock) =>{
            this.cellBlock = cellBlock;
            console.log("受信:cellBlock:",this.cellBlock);
        });
    }

    //対戦が始まって1回呼び出される関数
    oneTime(){
        //まずplayerListの何処に、このクライアントのデータが入ってるか判別します
        for(let i=0;i < this.playerList.length;i++){
            if(this.playerList[i].playerId == this.socket.id){
                this.myIndex = i;
            }
        }
        //coordinateの最初の中身(最初の一回だけ処理する,大きな問題はないけどバグが気になるので実装)
        //自キャラの0の座標を格納
        this.coordinate = Array(2);
        this.coordinate[0] = this.playerList[this.myIndex].characterList[0].coordinate[0];
        this.coordinate[1] = this.playerList[this.myIndex].characterList[0].coordinate[1];
        //値を変えて関数に入らないようにする
        this.oneTimeCheck = false;
    }

    //描画更新を行う場合に、一度経由するメソッド
    renderMain(){
        //一回盤の描画を初期化(「移動」で必要)
        for(let i=0;i < this.boardAppearance.length;i++){        //Y軸
            for(let j=0;j < this.boardAppearance[i].length;j++){ //X軸
                this.boardAppearance[i][j].setAttribute('src',this.imgeDir + 'cell' + this.jpg);
            }
        }

        //キャラクターとキャラクターの見えている範囲
        //生きているキャラクター体数分処理
        for(let i=0;i < this.playerList[this.myIndex].live;i++){
            //キャラクター設置
            this.boardAppearance[this.playerList[this.myIndex].characterList[i].coordinate[0]][this.playerList[this.myIndex].characterList[i].coordinate[1]].setAttribute('src',this.imgeDir + this.chara + this.directionImg[this.playerList[this.myIndex].characterList[i].direction] + this.jpg);
            //視界を表示
            for(let j=0;j < this.playerList[this.myIndex].characterList[i].view.length;j++){
                //盤の外に出ていないかを確認、盤外で無ければ反映させる(-1や7になると番外)
                //y:左の判定,y:右の判定,x:上の判定,x:下の判定
                if(this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0] >= 0
                && this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0] <= 6
                && this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1] >= 0
                && this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1] <= 6){
                    //見えた先に何も無い場合、「see.jpg」
                    this.boardAppearance[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].setAttribute('src', this.imgeDir + 'see' + this.jpg);
                    //見えた先に何かある場合(2021.7.20では、自キャラと敵キャラしか居ない)適した画像を表示
                    if(this.cellBlock[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].ridOn != null){
                        //自分のキャラを判定
                        if(this.cellBlock[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].ridOn.playerNo == this.playerList[this.myIndex].playerNo){//所属で調べる
                            this.boardAppearance[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].setAttribute('src',this.imgeDir + this.chara + this.directionImg[this.cellBlock[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].ridOn.direction] + this.jpg);
                        } else {
                            //相手のキャラを判定(自キャラ以外)
                            this.boardAppearance[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].setAttribute('src',this.imgeDir + this.chara + this.directionImg[this.cellBlock[this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0]][this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1]].ridOn.direction] + this.enemy + this.jpg);
                        }
                    }
                }
            }
        }

        //行動を選択して描画の変更を判定
        if(this.actionHold == null){
            //通常時の表示
            //選択した座標の埋まってるカードの表示
            this.buriedCardView();
        } else {
            if(this.actionHold == 0){
                //「採掘」の場合の描画処理に飛ばす
                this.renderMining();
            } else if(this.actionHold == 1){
                //「移動」の場合の描画処理に飛ばす
                this.renderMoveAndView();
            } else if(this.actionHold == 2){
                //「方向」の場合の描画処理に飛ばす
                this.renderDirection();
            }
        }

        //テキストの書き換え
        let textString = '';
        if(this.playerList[this.myIndex].myOrder) textString = "あなたの番です:";
        else textString = "相手の番です:";

        //自キャラが乗っているマスをクリックした場合
        if(this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn != null
             &&this.playerList[this.myIndex].playerNo == this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.playerNo){
            //盤からキャラクターの現在のHPを返す
            textString = textString + "味方です:HP:" + this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.currentHP + "/" + this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.maxHP;
            //選択したキャラクターが持っているカードの表示
            this.charaCardView(this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo);
        }

        //自キャラの視界で敵がいる場合
        //視界を表示
        //キャラクター毎に処理
        for(let i=0;i < this.playerList[this.myIndex].live;i++){
            for(let j=0;j < this.playerList[this.myIndex].characterList[i].view.length;j++){
                //キャラクターの視界でXとYが合致すれば、見えてる場所という事になる
                if(this.playerList[this.myIndex].characterList[i].coordinate[0] + this.playerList[this.myIndex].characterList[i].view[j][0] == this.coordinate[0]
                && this.playerList[this.myIndex].characterList[i].coordinate[1] + this.playerList[this.myIndex].characterList[i].view[j][1] == this.coordinate[1]
                && this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn != null && this.playerList[this.myIndex].playerNo != this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.playerNo){
                    textString = textString + "敵です";
                }
            }
        }

        //テキストの表記
        this.textAppearance.innerHTML = textString;
    }

    //「採掘」で選択する為の描画
    renderMining(){
        //
    }

    //「移動」を選択する為の描画
    //完成形は「キャラクター」の視界を表示するのにも使う処理
    renderMoveAndView(){
        //移動できる場マスの色を変える
        for(let i=0;i < this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed.length;i++){
            //盤の外に出ていないかを確認して、盤外で無ければ反映させる(-1や7になると番外)
            if(this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0] >= 0  //y:左の判定
            && this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0] <= 6  //y:右の判定
            && this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1] >= 0  //x:上の判定
            && this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1] <= 6){//x:下の判定
                //移動先が盤内に有る場合、まず「cell_move.jpg」
                this.boardAppearance[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].setAttribute('src',this.imgeDir + 'cellMove' + this.jpg);
                //移動先に"何か"ある場合(2021.7.20では、自キャラと敵キャラしか居ない)適した画像を表示
                if(this.cellBlock[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].ridOn != null){
                //自分のキャラの場合の判定
                    if(this.cellBlock[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].ridOn.playerNo == this.playerList[this.myIndex].playerNo){//所属で調べる
                        this.boardAppearance[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].setAttribute('src',this.imgeDir + this.chara + this.directionImg[this.cellBlock[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].ridOn.direction] + this.jpg);
                    } else {
                        //敵が居ることが解っている処理の中
                        //見えているかを判定
                        for(let j=0;j < this.playerList[this.myIndex].characterList[this.characterHold].view.length;j++){
                            if(this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].view[j][0] == [this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]]
                            && this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].view[j][1] == [this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]]){
                                //見えている処理
                                this.boardAppearance[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].setAttribute('src',this.imgeDir + this.chara + this.directionImg[this.cellBlock[this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0]][this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1]].ridOn.direction] + this.enemy + this.jpg);
                            }
                        }
                    }
                }
            }
        }
    }

    //「方向」を選択する為の描画
    renderDirection(){
        this.remainingDirection = [];
        for(let i=0;i < 4;i++){
            if(i != this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.direction){
                this.remainingDirection[i] = i;
            }
        }
        //配列がズレるので、nullを消して整える
        this.remainingDirection = this.remainingDirection.filter(Number.isFinite);
        //画像の表示
        for(let i=0;i < this.cardAppearance[1].length;i++){
            this.cardAppearance[1][i].setAttribute('src',this.imgeDir + this.directionImg[this.remainingDirection[i]] + this.jpg);
        }
    }

    //盤面をクリックした時の処理
    OnBoardClick(Y,X){
        //「行動」状態でクリックした場合
        if(this.actionHold != null){
            if(this.actionHold == 1){
                //「移動」でクリックした場合
                //移動できる座標をクリックしたかを判定
                for(let i=0;i < this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed.length;i++){
                    if(this.playerList[this.myIndex].characterList[this.characterHold].coordinate[0] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][0] == Y
                    &&this.playerList[this.myIndex].characterList[this.characterHold].coordinate[1] + this.playerList[this.myIndex].characterList[this.characterHold].moveSpeed[i][1] == X){
                        //移動できる座標を押している場合
                        //移動の処理
                        //元々居た場所から、キャラクターのデータを消す(coordinateは更新前で、選択したキャラクターの位置を示す)
                        this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn = null;
                        //移動先にキャラクターのデータを書き込む
                        this.cellBlock[Y][X].ridOn =  this.playerList[this.myIndex].characterList[this.characterHold];
                    }
                }
                this.socket.emit("cellBlock",this.cellBlock);
            }
            //処理が終わると行動を切る
            this.actionHold = null;
        }
        //クリックしたボタンを保存
        this.coordinate[0] = Y;
        this.coordinate[1] = X;
        //描画を更新
        this.renderMain();
    }

    //カード系のボタンを押した場合の処理
    CardClick(where,btnNo){
        //カードを使う以外の処理
        if(this.actionHold != null){
            if(this.actionHold == 2 && where == 1){
                //「方向」の処理
                //ループはremainingDirection.lengthつまり3回
                for(let i = 0;i < this.remainingDirection.length;i++){
                    if(btnNo == i){
                        //自分の,選択したキャラクターの,方向に = 描画の際格納した配列の中身を使って方向を代入する
                        this.playerList[this.myIndex].characterList[this.characterHold].direction = this.remainingDirection[i];
                    }
                }
                //行動を解除
                this.actionHold = null;
                //代入で値が変わった為サーバにデータを送る
                this.socket.emit("playerList",this.playerList);
            }
        } else {
            //自分のターンか調べてなかった
            //通常のカードを使う際の処理
            //自分のカードを押した処理
            if(where == 0){
                //使った場合
                console.log("ボタンNo",btnNo);
                console.log("カード",this.playerList);
                console.log("指定したカード",this.playerList[this.myIndex].characterList[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo].pocket);
                this.playerList[this.myIndex].characterList[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo].pocket[btnNo] = null;
                //配列がズレるので、nullを消して整える
                console.log("指定したカード",this.playerList[this.myIndex].characterList[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo].pocket);
                console.log("カード",this.playerList);
                this.playerList[this.myIndex].characterList[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo].pocket = this.playerList[this.myIndex].characterList[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo].pocket.filter(Number.isFinite);
                this.socket.emit("playerList",this.playerList);
                this.renderMain();
            }
        }
    }

    //埋まっているカードの閲覧ができるか
    buriedCardView(){
        //埋まってるカードの処理
        //閲覧権限はbool型により条件式は要らない
        if(this.cellBlock[this.coordinate[0]][this.coordinate[1]].viewAuthority[this.myIndex]){
            //見れる
            for(let i=0;i < this.cardAppearance[1].length;i++){
                //埋まってるカードを表示
                //ちゃんと効果のあるカードを実装し、画像を用意できたら細かく作る
                //カードに画像のディレクトリをもたせている
                this.cardAppearance[1][i].setAttribute('src',this.imgeDir + this.cellBlock[this.coordinate[0]][this.coordinate[1]].Card[i].cardImgDir);
            }
        } else {
            //見れない
            for(let i=0;i < this.cardAppearance[1].length;i++){
                this.cardAppearance[1][i].setAttribute('src',this.imgeDir +'cell.jpg');
            }
        }
    }

    //キャラクターの持つカードを見せる
    charaCardView(charaNo){
        for(let i=0;i < this.cardAppearance[0].length;i++){
            if(this.playerList[this.myIndex].characterList[charaNo].pocket[i] != null){
                this.cardAppearance[0][i].setAttribute('src',this.imgeDir + this.playerList[this.myIndex].characterList[charaNo].pocket[i].cardImgDir);
            } else {
                this.cardAppearance[0][i].setAttribute('src',this.imgeDir + 'cell.jpg');
            }
        }
    }

    //採掘ボタンの処理
    Mining(){
        if(this.behaviorjudgment()){
            //キャラクターの添字を格納する
            this.characterHold = this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo;
            //何が埋まってるか見れるようになる
            this.cellBlock[this.coordinate[0]][this.coordinate[1]].viewAuthority[this.myIndex] = true;
            //キャラクターが持っているカードが3枚以下の場合
            if(this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.pocket.length < this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.pocketSize){
                //採掘回数と埋まっているカードから取得したカードをキャラクターに格納する
                this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.pocket[this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.pocket.length] = this.cellBlock[this.coordinate[0]][this.coordinate[1]].Card[(this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.mines) % this.cellBlock[this.coordinate[0]][this.coordinate[1]].Card.length];
            } else {
                //三枚持っていて4枚の中から捨てるカードを選ぶ場合
                //フラグを立てて描画更新して終了
                this.actionHold = 0;
            }
            //採掘回数+1
            this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.mines++;
            //cellBlockの値が変わったので、サーバに送る
            this.socket.emit("cellBlock",this.cellBlock);
            //[終了]が押されるまでボタンを非アクティブ化
            this.miningAppearance.disabled = true;
            this.renderMain();
        }
    }

    //移動ボタン
    Move(){
        if(this.behaviorjudgment()){
            if(this.actionHold == null){
                //キャラクターの添字を格納する
                this.characterHold = this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo;
                this.actionHold = 1;
                this.moveAppearance.disabled = true;
            }
            this.renderMain();
        }
    }

    //方向ボタン
    //盤カードのボタンに向いている以外の方向の矢印を表示する
    Direction(){
        if(this.behaviorjudgment()){
            //何か別の行動を行っていないかを判定する
            if(this.actionHold == null){
                //「方向」に縛る処理
                this.characterHold = this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo;
                this.actionHold = 2;
                this.directionAppearance.disabled = true;
            }
            this.renderMain();
        }
    }

    //「行動」系のボタンを押す際の最初の判定を行う
    behaviorjudgment(){
        //自分のターンかを判定
        return this.playerList[this.myIndex].myOrder
            //選んだマスに自キャラが居るか
            && this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn != null
            && this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.playerNo == this.playerList[this.myIndex].playerNo
            //既に別の自キャラを行動させていないか。nullもしくはいま選択中の座標のキャラの添字ならOK
            &&(this.characterHold == null
            || this.characterHold == this.cellBlock[this.coordinate[0]][this.coordinate[1]].ridOn.myNo)
    }

    //終了ボタンを押したら、自分のターンが1つ進む3回進んだら相手にターンが渡る
    //1行動進める
    //色んな制限を解除する
    End(){
        //自分の番か調べる
        if(this.playerList[this.myIndex].myOrder){
            this.count++;
            //行動したキャラの開放
            this.characterHold = null;
            //行動の開放
            this.actionHold = null;
            //非アクティブにしたボタンをアクティブに戻す
            this.miningAppearance.disabled = false;
            this.moveAppearance.disabled   = false;
            this.directionAppearance.disabled = false;
            if(this.count == 3){
                this.playerList[this.myIndex].myOrder = false;
                this.playerList[(this.myIndex + 1)%this.playerList[this.myIndex].peopleNo].myOrder = true;
                //ターンを渡す際に、自分の行動回数を戻す
                this.count = 0;
                this.socket.emit("playerList",this.playerList);
            }
            this.renderMain();
        }
    }
}