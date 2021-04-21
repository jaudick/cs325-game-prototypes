using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public GameObject particle;
    public Shooter parent;
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.GetComponent<Barrier>() != null)
        {
            GameManager.instance.currentBullets--;
            GameManager.instance.BulletTextUpdate();
            parent.Shoot();
            Instantiate(particle, transform.position, Quaternion.identity);

            GameManager.instance.black--;
            GameManager.instance.BlackTextUpdate();

            Destroy(gameObject);
        }


        else if (collision.gameObject.CompareTag("Base"))
        {
            GameManager.instance.currentBullets--;
            GameManager.instance.BulletTextUpdate();
            parent.Shoot();
            Instantiate(particle, transform.position, Quaternion.identity);

            GameManager.instance.baseHealth--;
            GameManager.instance.BaseTextUpdate();

            if (GameManager.instance.baseHealth <= 0)
            {
                GameManager.instance.Restart();
            }
            Destroy(gameObject);
        }

    }

    public void DestroyBullet()
    {
        GameManager.instance.currentBullets--;
        GameManager.instance.BulletTextUpdate();
        parent.Shoot();
        Instantiate(particle, transform.position, Quaternion.identity);
        Destroy(gameObject);
    }
}
