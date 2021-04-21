using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WhiteBarrier : MonoBehaviour
{
    public bool isLeft = false;
    public float speed = 5f;
    public GameObject particle;

    private void Start()
    {
        Rigidbody2D rbody = GetComponent<Rigidbody2D>();
        if (isLeft) rbody.velocity = new Vector2(-speed, 0);
        else rbody.velocity = new Vector2(speed, 0);
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.GetComponent<Bullet>()!=null)
        {
            collision.gameObject.GetComponent<Bullet>().DestroyBullet();
        }

        else if(collision.CompareTag("Wall"))
        {
            Instantiate(particle, transform.position, Quaternion.identity);
            Destroy(gameObject);
        }
    }
}
