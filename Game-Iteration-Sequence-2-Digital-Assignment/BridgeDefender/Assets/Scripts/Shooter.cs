using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shooter : MonoBehaviour
{
    public GameObject bullet;

    private void Start()
    {
        Shoot();
    }
    public void Shoot()
    {
        GameObject projectile = Instantiate(bullet, transform.position, Quaternion.identity);
        Bullet bulletScript = projectile.GetComponent<Bullet>();
        bulletScript.parent = this;
    }
}
