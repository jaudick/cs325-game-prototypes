using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;
    public static int maxBulletsLeft = 10;
    public int currentBullets;
    public static int baseMaxHealth = 8;
    public int baseHealth;
    public static int whiteMax = 2;
    public int white;
    public static int blackMax = 6;
    public int black;
    public Text bulletText;
    public Text baseText;
    public Text whiteText;
    public Text blackText;

    private void Awake()
    {
        instance = this;
        currentBullets = maxBulletsLeft;
        baseHealth = baseMaxHealth;
        white = 0;
        black = 0;
    }
    private void Start()
    {
        BulletTextUpdate();
        BaseTextUpdate();
        BlackTextUpdate();
        WhiteTextUpdate();
    }

    public void Restart()
    {
        SceneManager.LoadScene("Main");
    }

    public void BulletTextUpdate()
    {
        bulletText.text = "Enemy Bullets: " + currentBullets;
    }

    public void BaseTextUpdate()
    {
        baseText.text = "Base Health: " + baseHealth + "/" + baseMaxHealth;
    }

    public void WhiteTextUpdate()
    {
        whiteText.text = "White Thrown: " + white + "/" + whiteMax;
    }

    public void BlackTextUpdate()
    {
        blackText.text = "Black Placed: " + black + "/" + blackMax;
    }
}
