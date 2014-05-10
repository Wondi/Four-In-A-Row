var game_board_columns = [[], [], [], [], [], [], []];
var player_coins = 0;
var game_is_on_flag = true;
var game_has_started_flag = false;
var game_board_rows = 6;

// Models Functions for Adding and Remving Highlights
var add_highlight = function() {
  $(this).addClass("box_shadow_highlight");
};
var remove_highlight = function() {
  $(this).removeClass("box_shadow_highlight");
};

// Model Function to swap current player
var change_current_player = function() {
  if(game_has_started_flag) return;
  player_coins++;
  refresh_player_coin();
};

//Model Function to Refresh Player Coin Info
var refresh_player_coin = function() {
  $(".game_board_info .coin").addClass("deleteme");
  $(".deleteme").remove();
  var player_class = player_coins%2 ? "first_player" : "second_player";
  var newToken = "<div style=\"display:none\" class=\"coin "
  + player_class + "\"><span></div>";
  $(".game_board_info").append($(newToken));
  $(".game_board_info .coin").show();
  $(".game_board_info .coin").click(change_current_player);
};

//Animate Distance Model Function
var drop_player_coin_distance = function(index) {
  return (game_board_rows + 0.15 - game_board_columns[index].length) * 26;
};

//Model Function to find coin given cordinates and coin type
var find_in_game_board = function(type, x, y) {
    if((x < 0) || (x > 6)) return false;
    if((y < 0) || (y > game_board_rows - 1)) return false;
    if(game_board_columns[x].length < (y + 1)) return false;
    return (game_board_columns[x][y] === type);
};

// Model Function to process in realtime Game Winner
var verify_winner_game = function(type, x, y) {
    if(!find_in_game_board(type, x, y)){
      return false;
    }
    var direct = [[1,0], [1,1], [0,1], [1,-1]];
    var matches = 0;
    for(var i = 0; i < 4; i++) {
        for(var j = 1; ; j++)
            if(find_in_game_board(type, x+j*direct[i][0], y+j*direct[i][1]))
                matches++;
            else break;
        for(var j = 1; ; j++)
            if(find_in_game_board(type, x-j*direct[i][0], y-j*direct[i][1]))
                matches++;
            else break;
        if(matches >= 3) return true;
        matches = 0;
    }
    return false;
};

// Model Function to process in realtime Game Drawn Stage
var verify_drawn_game = function() {
    for(var i = 0; i < game_board_columns.length; i++)
        if(game_board_columns[i].length < game_board_rows)
            return;
    $(".game_board_info h2").text("Draw!");
    $(".game-end").show();
    game_is_on_flag = false;
};

// Model Function for RealTime Game AI
var process_game_board = function(index) {
    if(!game_is_on_flag) return false;
    var colLength = game_board_columns[index].length;
    if(colLength >= game_board_rows){
      alert("Reached Limit of 6 for this column bucket");
      return false;
    }
    player_coins++;
    var type = player_coins % 2;
    game_board_columns[index].push(type);
    if(verify_winner_game(type, index, colLength)) {
        $(".game-end").show();
        game_is_on_flag = false;
    }
    if(game_is_on_flag && game_board_columns[index].length === game_board_rows)
        verify_drawn_game();
    return true;
};

//Model Function for Turn of Player
var player_turn = function() {
    var index = $(this).parent().index();
    if(!process_game_board(index)) return;
    game_has_started_flag = true;
    var player_class = player_coins%2 ? "second_player" : "first_player";
    var newToken = "<div class=\"coin " + player_class + "\"></div>";
    $(this).prev().prepend(newToken);
    var t = $(this).prev().children(".coin:first-child").position().top;
    $(this).prev().children(".coin:first-child").css("top", t);
    $(this).prev().children(".coin:first-child").animate({top:"+="+drop_player_coin_distance(index)+"px"}, 300);
    if(!game_is_on_flag) return;
    refresh_player_coin();
};


$(document).ready(function() {
  // Event Function for New Game Button
  $(".btn-new-game").click(function() {
    $(".game_board .coin").fadeOut(function()
        {$(this).remove();});
    for(var i = 0; i < game_board_columns.length; i++) game_board_columns[i] = [];
    $(".game-end").hide();
    $(".game_board_info h2").text("Game Won!");
    game_is_on_flag = true;
    game_has_started_flag = false;
    refresh_player_coin();
  });
  // Event Function for Change Current Player
  $(".game_board_info .coin").click(change_current_player);
  // Event Function to Add/Remove Highlight on Button MouseEnter/MouseLeave
  $(".place_coin").mouseenter(add_highlight);
  $(".place_coin").mouseleave(remove_highlight);
  // Event Function for Player Turn
  $(".grid_column .place_coin").click(player_turn);
});