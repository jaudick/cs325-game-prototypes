using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;
    public static int maxBulletsLeft = 50;
    public int currentBullets;
    public static int baseMaxHealth = 3;
    public int baseHealth;
    public static int whiteMax = 2;
    public int white;
    public static int blackMax = 6;
    public int black;
    public Text bulletText;
    public Text baseText;
    public Text whiteText;
    public Text blackText;
    public Text looseText;
    public Text winText;
    public static float gravityScaleIncrease = 0.0f;

    public bool gameOver;
    private bool lost = false;

    private void Awake()
    {
        lost = false;
        gameOver = false;
        instance = this;
        currentBullets = maxBulletsLeft;
        baseHealth = baseMaxHealth;
        white = 0;
        black = 0;
        gravityScaleIncrease = 0;
    }

    private void Start()
    {
        BulletTextUpdate();
        BaseTextUpdate();
        BlackTextUpdate();
        WhiteTextUpdate();
    }

    private void Update()
    {
        if(currentBullets <= 0 && !gameOver)
        {
            lost = true;
            gameOver = true;
            Win();
        }
        else if(baseHealth <= 0 && !gameOver && !lost)
        {
            gameOver = true;
            Loose();
        }
    }

    public void Restart(float time = 2f)
    {
        StartCoroutine(RestartCo(time));
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

    public void Loose()
    {
        looseText.gameObject.SetActive(true);
        Restart();
    }

    public void Win(float time = 5f)
    {
        winText.gameObject.SetActive(true);
        Restart(time);
    }

    IEnumerator RestartCo(float time = 2f)
    {
        yield return new WaitForSeconds(time);
        SceneManager.LoadScene("Main");
    }
}
