(function() {
  var turn;
  // 数字が1or2ならCPU、それ以外の数字にすれば人対人
  var computer = 3

  // x,yに置けるかどうかと裏返すかどうか
  var checkReverse = function(x, y, flip) {
    var ret = 0;
    // 8方向の確認
    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        // 再帰
        if(dx == 0 && dy == 0) { continue; }
        var nx = x + dx, ny = y + dy, n = 0;
        // 黒なら黒白なら白で繰り返す
        while(board[nx][ny] == 3 - turn) {
          n++; nx += dx; ny += dy;
        }
        // 自分自身の色であればという条件
        if(n > 0 && board[nx][ny] == turn) {
          ret += n;
          if(flip) {
            nx = x + dx; ny = y + dy;
            while(board[nx][ny] == 3 - turn) {
              board[nx][ny] = turn;
              nx += dx; ny += dy;
            }
            // 自分の色で置く
            board[x][y] = turn;
          }
        }
      }
    }
    return ret;
  };

  // コンピューター操作
  var moveComputer = function() {
    if(turn == computer) {
      for (var x = 1; x <= 8; x++) {
        for (var y = 1; y <= 8; y++) {
          if (board[x][y] == 0 && checkReverse(x, y, true)) {
            changeTurn();
            return;
          }
        }
      }
    }
  };

  var changeTurn = function() {
    var black = 0, white = 0;
    // ターンの切り替え(1なら黒、2なら白と切り替わっていく)
    turn = 3 - turn;
    // 三項演算子(turn=1が白の場合と黒の場合の処理)
    var message = ((turn == 1)?"黒":"白");
    for(var x = 1; x <= 8; x++) {
      for (var y = 1; y <= 8; y++) {
        // パスの条件式(物が置ける状態で置けなかったら)
        if(board[x][y] == 0 && checkReverse(x, y, false)) {
          document.getElementById("message").innerHTML = message + "の番です";
          showBoard();
          moveComputer();
          return;
        }
      }
    }
    turn = 3 - turn;
    message += "パス<br>"; + ((turn == 1) ? "黒" : "白") + "の番です";
    for (var x = 1; x <= 8; x++) {
      for (var y = 1; y <= 8; y++) {
        if (board[x][y] == 0 && checkReverse(x, y, false)) {
          document.getElementById("message").innerHTML = message;
          showBoard();
          return;
        } else {
          // 石の数を数える
          if(board[x][y] == 1) {
            black++;
          } else if(board[x][y] == 2) {
            white++;
          }
        }
      }
    }
    message = "黒：" + black + "白：" + white + "<br>";
    // 両方パスの時(決着)
    // 引き分けの場合のメッセージ
    if(black == white) {
      message += "引き分け"
    // それ以外はどちらかの勝ち
    } else {
      message += ((black > white)? "黒": "白") + "の勝ち";
    }
    document.getElementById("message").innerHTML = message;
    showBoard();
  }
  var piece;
  // boardを表示
  var showBoard = function() {
    var b = document.getElementById("board");
    // 番兵があるかr1からスタート
    for(var y = 1; y <= 8; y++) {
      for(var x = 1; x <= 8; x++) {
        var c = piece[board[x][y]].cloneNode(true);
        c.style.left = ((x - 1) * 50) + "px";
        c.style.top = ((y - 1) * 50) + "px";
        b.appendChild(c);
        // クリックしたら置く処理
        if(board[x][y] == 0) {
          // クロージャー(戻り値を保持したまま引数に使える関数)
          (function() {
            var _x = x, _y = y;
            c.onclick = function() {
              // 確認後置く処理
              if (checkReverse(_x, _y, true)) {
                changeTurn();
              }
            };
          })();
        }
      }
    }
  };

  // boardを二次元配列として作成
  var board = [];
  onload = function() {
    turn = 2;
    piece = [document.getElementById("cell"), document.getElementById("black"), document.getElementById("white")];
    // 縦横１列づつ余分に列を作成し、コマをひっくり返す判定の際、配列の座標を考慮しなくてよくする(番兵)
    for(var i = 0; i < 10; i++) {
      // iに配列を代入
      board[i] = [];
      for(var j = 0; j < 10; j++) {
        // 特定の場所を取得できるようにする
        board[i][j] = 0;
      }
    }
    // 黒
    board[4][5] = 1;
    board[5][4] = 1;
    // 白
    board[4][4] = 2;
    board[5][5] = 2;
    changeTurn();
  };

})();