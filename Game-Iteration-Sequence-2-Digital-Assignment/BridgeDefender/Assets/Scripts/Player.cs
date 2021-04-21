using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    Rigidbody2D rbody;
    public float speed = 5f;
    public Transform spawner;
    public GameObject barrier;
    public GameObject whiteBarrier;

    private void Awake()
    {
        rbody = GetComponent<Rigidbody2D>();
    }
    private void FixedUpdate()
    {
        float x = Input.GetKey(KeyCode.RightArrow) ? 1 : Input.GetKey(KeyCode.LeftArrow) ? -1 : 0;
        float y = Input.GetKey(KeyCode.UpArrow) ? 1 : Input.GetKey(KeyCode.DownArrow) ? -1 : 0;
        Vector2 movement = new Vector2(x, y).normalized;
        rbody.velocity = movement * speed;

    }

    private void Update()
    {
        if(Input.GetKeyDown(KeyCode.W))
        {
            if (GameManager.instance.black < GameManager.blackMax)
            {
                GameManager.instance.black++;
                GameManager.instance.BlackTextUpdate();
                Instantiate(barrier, spawner.position, Quaternion.identity);
            }
        }

        if(Input.GetKeyDown(KeyCode.A))
        {
            if(GameManager.instance.white < GameManager.whiteMax)
            {
                GameManager.instance.white++;
                GameManager.instance.WhiteTextUpdate();
                GameObject white = Instantiate(whiteBarrier, transform.position, Quaternion.identity);
                white.GetComponent<WhiteBarrier>().isLeft = true;
            }
        }
    }
}
