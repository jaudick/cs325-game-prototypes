using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public GameObject particle;
    public Shooter parent;
    private void Start()
    {
        GetComponent<Rigidbody2D>().gravityScale += GameManager.gravityScaleIncrease;
    }
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.GetComponent<Barrier>() != null)
        {
            Instantiate(particle, transform.position, Quaternion.identity);

            GameManager.instance.black--;
            GameManager.instance.BlackTextUpdate();
            DestroyBullet();
        }


        else if (collision.gameObject.CompareTag("Base"))
        {
            Instantiate(particle, transform.position, Quaternion.identity);

            if (GameManager.instance.baseHealth > 0)
            {
                GameManager.instance.baseHealth--;
                GameManager.instance.BaseTextUpdate();
                if (GameManager.instance.baseHealth <= 0)
                {
                    GameManager.instance.Restart();
                }
            }
            DestroyBullet();
        }

        else if (collision.gameObject.CompareTag("Player"))
        {
            if (!GameManager.instance.gameOver)
            {
                Player.player.Defeated();
                Instantiate(particle, transform.position, Quaternion.identity);
                GameManager.instance.Restart();
            }
        }

    }

    public void DestroyBullet()
    {
        if (GameManager.instance.currentBullets > 0 && !GameManager.instance.gameOver)
        {          
            GameManager.gravityScaleIncrease += 0.0075f;
            GameManager.instance.currentBullets--;
            GameManager.instance.BulletTextUpdate();
            parent.Shoot();
            Player.speed += GameManager.gravityScaleIncrease;
        }
        Instantiate(particle, transform.position, Quaternion.identity);
        Destroy(gameObject);
    }
}
