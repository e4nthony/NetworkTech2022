package com.example.hw1_tictactoe;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;

import com.example.hw1_tictactoe.DataVault.DataVault;

/** @author Anthony Epshtein */
public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private static final int CONSTLENGTH = 3;

    private static DataVault data;
    private static ImageButton[][] buttonsLinks;
    private ImageButton focusedButtonLink;

    private ImageView game_field_InfoBar_iv;
    private ImageView game_field_GridImage_iv;
    private ImageView game_field_GreenLinesImagesContainer_iv;

    private Button game_field_PlayAgain_button;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_main);
        setContentView(R.layout.game_field); // for testing, todo: delete
        //------------------------------------
        data = DataVault.getInstance();
        buttonsLinks = new ImageButton[CONSTLENGTH][CONSTLENGTH];


        // Bindings:
        // --------------------- Main Menu - activity_main ---------------------

//        Button menu_start_button = findViewById(R.id.menu_start_button); // for testing, todo: enable
        // TODO: if pressed >>>>  setContentView(R.layout.game_field);


        // ---------------------------- game_field ----------------------------

        // ---- top - info image ----
        game_field_InfoBar_iv = findViewById(R.id.game_field_InfoBar_iv);
        game_field_InfoBar_iv.setImageResource(R.drawable.x_play);

        // ---- middle - desk ----
        game_field_GridImage_iv = findViewById(R.id.game_field_GridImage_iv);
        game_field_GreenLinesImagesContainer_iv = findViewById(R.id.game_field_GreenLinesImagesContainer_iv);


        buttonsLinks[0][0] = findViewById(R.id.game_field_img_btn00);
        buttonsLinks[0][1] = findViewById(R.id.game_field_img_btn01);
        buttonsLinks[0][2] = findViewById(R.id.game_field_img_btn02);
        buttonsLinks[1][0] = findViewById(R.id.game_field_img_btn10);
        buttonsLinks[1][1] = findViewById(R.id.game_field_img_btn11);
        buttonsLinks[1][2] = findViewById(R.id.game_field_img_btn12);
        buttonsLinks[2][0] = findViewById(R.id.game_field_img_btn20);
        buttonsLinks[2][1] = findViewById(R.id.game_field_img_btn21);
        buttonsLinks[2][2] = findViewById(R.id.game_field_img_btn22);

        buttonsLinks[0][0].setOnClickListener(this);
        buttonsLinks[0][1].setOnClickListener(this);
        buttonsLinks[0][2].setOnClickListener(this);
        buttonsLinks[1][0].setOnClickListener(this);
        buttonsLinks[1][1].setOnClickListener(this);
        buttonsLinks[1][2].setOnClickListener(this);
        buttonsLinks[2][0].setOnClickListener(this);
        buttonsLinks[2][1].setOnClickListener(this);
        buttonsLinks[2][2].setOnClickListener(this);


        // ---- bottom ----
        game_field_PlayAgain_button = findViewById(R.id.game_field_PlayAgain_button);

        game_field_PlayAgain_button.setOnClickListener(this);
        // --------------------------------------------------------------------
    }

    @Override
    public void onClick(View v) {
        int x = -1, y = -1;

        switch (v.getId()) {

            case R.id.game_field_img_btn00:
                x = 0;
                y = 0;
                break;

            case R.id.game_field_img_btn01:
                x = 0;
                y = 1;
                break;

            case R.id.game_field_img_btn02:
                x = 0;
                y = 2;
                break;

            case R.id.game_field_img_btn10:
                x = 1;
                y = 0;
                break;

            case R.id.game_field_img_btn11:
                x = 1;
                y = 1;
                break;

            case R.id.game_field_img_btn12:
                x = 1;
                y = 2;
                break;

            case R.id.game_field_img_btn20:
                x = 2;
                y = 0;
                break;

            case R.id.game_field_img_btn21:
                x = 2;
                y = 1;
                break;

            case R.id.game_field_img_btn22:
                x = 2;
                y = 2;
                break;

            case R.id.game_field_PlayAgain_button:
                ClearDesk();
                return;

            default:
                try {
                    throw new Exception("Unknown button");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }

        focusedButtonLink = buttonsLinks[x][y];

        State thisMoveWasPerformedBy = data.getCurrentPlayer();


        Log.d("TAG", "Try to make move = Player: " + thisMoveWasPerformedBy + " Where: " + x + y + " *(RawValues[0,1,2])");

        boolean result = data.makeMove(x, y);

        switch (thisMoveWasPerformedBy) {

            case X:
                focusedButtonLink.setImageResource(R.drawable.x_mark);
                focusedButtonLink.setEnabled(false);
                break;
            case O:
                focusedButtonLink.setImageResource(R.drawable.o_mark);
                focusedButtonLink.setEnabled(false);
                break;

            default:
                try {
                    throw new Exception("Error");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
        }

        if (data.isGameOver() == true) {
            printVictory();
            game_field_PlayAgain_button.setVisibility(View.VISIBLE);
            game_field_PlayAgain_button.setEnabled(true);

        }
        else{
            State p = data.getCurrentPlayer();
            if (p == State.O) {  //switch to next player bar tittle
                game_field_InfoBar_iv.setImageResource(R.drawable.o_play);
            }
            else {
                game_field_InfoBar_iv.setImageResource(R.drawable.x_play);
            }
        }
    }

    private void printVictory() {
        State lostPlayer = data.getCurrentPlayer();

        if(lostPlayer == State.X)
        {
            game_field_InfoBar_iv.setImageResource(R.drawable.o_win);
        }
        else if(lostPlayer == State.O)
        {
            game_field_InfoBar_iv.setImageResource(R.drawable.x_win);
        }
        else if(lostPlayer == State.NONE)
        {
            game_field_InfoBar_iv.setImageResource(R.drawable.no_winner);
        }

        // --- block buttons ---
        for (int i = 0; i < CONSTLENGTH; ++i) {
            for (int j = 0; j < CONSTLENGTH; ++j) {
                buttonsLinks[i][j].setEnabled(false); // disable buttons
            }
        }

        game_field_GreenLinesImagesContainer_iv.setImageResource(data.getGreenLineImageID());

        game_field_GreenLinesImagesContainer_iv.setVisibility(View.VISIBLE);
    }

    private void ClearDesk() {
        data.createNewGame();

        game_field_PlayAgain_button.setEnabled(false);
        game_field_PlayAgain_button.setVisibility(View.GONE);


        game_field_InfoBar_iv.setImageResource(R.drawable.x_play);

        game_field_GreenLinesImagesContainer_iv.setImageResource(R.drawable.empty);
        game_field_GreenLinesImagesContainer_iv.setVisibility(View.GONE);

        for (int i = 0; i < CONSTLENGTH; ++i) {
            for (int j = 0; j < CONSTLENGTH; ++j) {
                buttonsLinks[i][j].setImageResource(R.drawable.empty);  // set empty image by default
                buttonsLinks[i][j].setEnabled(true);                    // enable buttons
            }
        }
    }

}
