using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerAudio : MonoBehaviour
{
    AudioSource audioSource;

    public AudioClip black;
    public AudioClip white;
    private void Awake()
    {
        audioSource = GetComponent<AudioSource>();
    }

    public void Black()
    {
        audioSource.PlayOneShot(black);
    }

    public void White()
    {
        audioSource.PlayOneShot(white, 5f);
    }

}
