using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public static Player player;
    Rigidbody2D rbody;
    public static float speed = 6f;
    private float speedMultiplier = 2f;
    public Transform spawner;
    public GameObject barrier;
    public GameObject whiteBarrier;
    public PlayerAudio playerAudio;

    private void Awake()
    {
        player = this;
        rbody = GetComponent<Rigidbody2D>();
        speed = 6f;
    }
    private void FixedUpdate()
    {
        float x = Input.GetKey(KeyCode.D) ? 1 : Input.GetKey(KeyCode.A) ? -1 : 0;
        float y = Input.GetKey(KeyCode.W) ? 1 : Input.GetKey(KeyCode.S) ? -1 : 0;
        Vector2 movement = new Vector2(x, y).normalized;
        float speedBoost = Input.GetKey(KeyCode.Space) ? 1 : 1;
        rbody.velocity = movement * speed * speedBoost;

    }

    private void Update()
    {
        if(Input.GetKeyDown(KeyCode.Mouse0))
        {
            if (GameManager.instance.black < GameManager.blackMax)
            {
                playerAudio.Black();
                GameManager.instance.black++;
                GameManager.instance.BlackTextUpdate();
                Instantiate(barrier, spawner.position, Quaternion.identity);
            }
        }

        if(Input.GetKeyDown(KeyCode.Mouse1))
        {
            if(GameManager.instance.white <= 0)
            {
                playerAudio.White();
                GameObject white = Instantiate(whiteBarrier, transform.position, Quaternion.identity);
                white.GetComponent<WhiteBarrier>().isLeft = true;

                GameObject white2 = Instantiate(whiteBarrier, transform.position, Quaternion.identity);
                white2.GetComponent<WhiteBarrier>().isLeft = false;
            }
        }
    }

    public void Defeated()
    {
        GameManager.instance.Loose();
        player.gameObject.SetActive(false);
    }
}
