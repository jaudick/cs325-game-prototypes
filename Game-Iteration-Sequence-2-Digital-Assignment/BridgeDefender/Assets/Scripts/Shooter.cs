using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shooter : MonoBehaviour
{
    public GameObject bullet;
    public AudioClip clip;
    bool wait = true;
    private AudioSource audioSource;

    private void Start()
    {
        audioSource = GetComponent<AudioSource>();
        wait = true;
        StartCoroutine(Wait());
        Shoot();
    }

    public void Shoot()
    {
        if (GameManager.instance.currentBullets > 0)
        {
            if (!wait) { audioSource.PlayOneShot(clip); }
            GameObject projectile = Instantiate(bullet, transform.position, Quaternion.identity);
            Bullet bulletScript = projectile.GetComponent<Bullet>();
            bulletScript.parent = this;
        }
    }

    IEnumerator Wait()
    {
        yield return new WaitForSeconds(1f);
        wait = false;
    }
}
