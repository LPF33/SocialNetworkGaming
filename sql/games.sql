DROP TABLE IF EXISTS games;

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    game VARCHAR(200) NOT NULL,
    info VARCHAR,
    picturefile VARCHAR NOT NULL
);


INSERT INTO games (game,info,picturefile) VALUES ('BreakOut','My first self-programmed game. Simple game play: Move the paddle with the left and right arrow keys and shoot the blocks with the ball. The ball must hit the paddle(on top) or you lose.', '/public/game1.PNG');
INSERT INTO games (game,info,picturefile) VALUES ('Sudoku', 'Sudoku is played on a grid of 9 x 9 spaces. Within the rows and columns are 9 squares. Each row, column and square needs to be filled out with the numbers 1-9, without repeating any numbers within the row, column or square. ' ,'/public/sudoku.PNG');
INSERT INTO games (game,info,picturefile) VALUES ('JumpRabbit', 'Who is faster on the opposing side? The game pieces change after each move either rabbit or stone. A rabbit can jump over game pieces and a stone can move one space.' ,'/public/JumpRabbit.PNG');
INSERT INTO games (game,info,picturefile) VALUES ('Memory', 'Who does not know memory? Find all pairs! You can decide how many pairs (16-50). Either choose pictures or numbers or colors (impossible!).','/public/Memory.PNG');
INSERT INTO games (game,info,picturefile) VALUES ('Meisterdieb', 'The aim of the game is either to take all enemy knights or to beat all warships of the enemy in the field or prevent the opponent from moving the robber stone!','/public/Meisterdieb.PNG');
INSERT INTO games (game,info,picturefile) VALUES ('ConnectFour', 'The aim for both players is to make a straight line of four own pieces; the line can be vertical, horizontal or diagonal.','/public/ConnectFour.PNG');