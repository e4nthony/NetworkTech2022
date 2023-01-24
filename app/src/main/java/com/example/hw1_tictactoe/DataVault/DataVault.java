package com.example.hw1_tictactoe.DataVault;

import android.util.Log;

import com.example.hw1_tictactoe.R;
import com.example.hw1_tictactoe.State;

/** @author Anthony Epshtein */
public class DataVault {

    private static final int CONSTLENGTH = 3;
    private static final int ROW = 0;
    private static final int COL = 1;

    private static DataVault INSTANCE;
    private State[][] data;

    private int[] btn_Position; //last pressed button's position. Uses ROW/COL Consts.
    private State currentPlayer;

    private int greenLineImageID;
    private boolean isGameOverVal;

    private int countOfDoneMoves;


    /** private Constructor implements singleton */
    private DataVault() {
        data = new State[3][3]; // desk 3x3
        btn_Position = new int[2];
        createNewGame();
    }

    public DataVault createNewGame() {

        for (int i = 0; i < CONSTLENGTH; ++i) {
            for (int j = 0; j < CONSTLENGTH; ++j) {
                data[i][j] = State.NONE;
            }
        }

        btn_Position[ROW] = -1;
        btn_Position[COL] = -1;

        currentPlayer = State.X;

        greenLineImageID = R.drawable.empty;
        isGameOverVal = false;

        countOfDoneMoves = 0;

        return INSTANCE;

    }

    /** access to Constructor via getInstance() func. */
    public static DataVault getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new DataVault();
        }
        return INSTANCE;
    }

    public State[][] getData() {
        return data;
    }

    public State getCurrentPlayer() {
        return currentPlayer;
    }

    public int[] getLastPressedBtnID() {
        return btn_Position;
    }

    public Boolean makeMove(int x, int y){
        //todo counter
        if (isGameOverVal) {
            return false;
        }
        else if (data[x][y] != State.NONE) {
            return false;
        }

        // --- update values ---

        btn_Position[ROW] = x;
        btn_Position[COL] = y;

        data[x][y] = currentPlayer; // = O OR = X

        Log.d("TAG", "Move Saved = Player: " + currentPlayer + " Where: " + x + y + " *(RawValues[0,1,2])");
        ++countOfDoneMoves;

        if (currentPlayer == State.X) {  //switch to next player
            currentPlayer = State.O;
        }
        else {
            currentPlayer = State.X;
        }


        checkVictory();

        if (isGameOverVal == false){
            if (countOfDoneMoves >= 9){
                isGameOverVal = true;
                currentPlayer = State.NONE; //no winner
            }
        }

        return true;
    }

    private void checkVictory() {
        // |X    |
        // |  X  |
        // |    X|
        if ( (data[0][0] == State.X && data[1][1] == State.X && data[2][2] == State.X) ||
             (data[0][0] == State.O && data[1][1] == State.O && data[2][2] == State.O)    ){
            greenLineImageID = R.drawable.mark1; isGameOverVal = true;
        }
        // |    X|
        // |  X  |
        // |X    |
        else if ( (data[0][2] == State.X && data[1][1] == State.X && data[2][0] == State.X) ||
                  (data[0][2] == State.O && data[1][1] == State.O && data[2][0] == State.O)    ){
            greenLineImageID = R.drawable.mark2; isGameOverVal = true;
        }
        // |X    |
        // |X    |
        // |X    |
        else if ( (data[0][0] == State.X && data[1][0] == State.X && data[2][0] == State.X) ||
                  (data[0][0] == State.O && data[1][0] == State.O && data[2][0] == State.O)    ){
            greenLineImageID = R.drawable.mark3; isGameOverVal = true;
        }
        // |  X  |
        // |  X  |
        // |  X  |
        else if ( (data[0][1] == State.X && data[1][1] == State.X && data[2][1] == State.X) ||
                  (data[0][1] == State.O && data[1][1] == State.O && data[2][1] == State.O)    ){
            greenLineImageID = R.drawable.mark4; isGameOverVal = true;
        }
        // |    X|
        // |    X|
        // |    X|
        else if ( (data[0][2] == State.X && data[1][2] == State.X && data[2][2] == State.X) ||
                  (data[0][2] == State.O && data[1][2] == State.O && data[2][2] == State.O)    ){
            greenLineImageID = R.drawable.mark5; isGameOverVal = true;
        }
        // |X X X|
        // |     |
        // |     |
        else if ( (data[0][0] == State.X && data[0][1] == State.X && data[0][2] == State.X) ||
                  (data[0][0] == State.O && data[0][1] == State.O && data[0][2] == State.O)    ){
            greenLineImageID = R.drawable.mark6; isGameOverVal = true;
        }
        // |     |
        // |X X X|
        // |     |
        else if ( (data[1][0] == State.X && data[1][1] == State.X && data[1][2] == State.X) ||
                  (data[1][0] == State.O && data[1][1] == State.O && data[1][2] == State.O)    ){
            greenLineImageID = R.drawable.mark7;  isGameOverVal = true;
        }
        // |     |
        // |     |
        // |X X X|
        else if ( (data[2][0] == State.X && data[2][1] == State.X && data[2][2] == State.X) ||
                  (data[2][0] == State.O && data[2][1] == State.O && data[2][2] == State.O)    ){
            greenLineImageID = R.drawable.mark8; isGameOverVal = true;
        }


    }

    public boolean isGameOver() {
        return isGameOverVal;
    }

    public int getGreenLineImageID() {
        return greenLineImageID;
    }


}