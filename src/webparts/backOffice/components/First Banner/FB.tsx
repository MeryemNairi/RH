import * as React from 'react';
 
import { useEffect, useState } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
 
import styles from './FB.module.scss';
 
 
 
export interface IFBProps {
  context: WebPartContext;
}
 
 
 
 
const FirstBanner: React.FC<IFBProps> = ({ context }) => {
 
 
 
  const [userDisplayName, setUserDisplayName] = useState<string>('');
 
 
  useEffect(() => {
 
    setUserDisplayName(context.pageContext.user.displayName);
 
  }, [context]);
 
 
  return (
 
 
    <div className={styles.FB_main}>
      <div className={styles.FB_container}>
        <div className={styles.FB_background}>
          <div className={styles.left}>
            <img src="/sites/Cnet/Assets/P-C-image.png" alt="" />
          </div>
          <div className={styles.right}>
                <svg width="172" height="257" viewBox="0 0 172 257" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M170.774 171.027V171.027C170.541 218.163 132.141 256.185 85.0048 255.951V255.951L85.4275 170.604L170.774 171.027Z" fill="#038B74 "/>
                <path d="M170.577 171.222L85.2314 170.603L85.8506 85.2573V85.2573C132.986 85.5992 170.919 124.087 170.577 171.222V171.222Z" fill="#F0F0F0"/>
                <path d="M86.1934 85.2588L85.7707 170.606L0.423761 170.183V170.183C0.657203 123.047 39.0576 85.0253 86.1934 85.2588V85.2588Z" fill="#58B3A2 "/>
                <path d="M171.709 0.844238L171.286 86.1912L85.9394 85.7685V85.7685C86.1728 38.6327 124.573 0.610796 171.709 0.844238V0.844238Z" fill="#0A9983 "/>
                <path d="M85.5957 255.452L0.248482 255.094L0.60691 169.746V169.746C47.7429 169.944 85.7937 208.316 85.5957 255.452V255.452Z" fill="#F0F0F0"/>
                </svg>
 
          </div> 
        </div>
        <div className={styles.content}>
          <p>
            <span style={{ fontWeight: 700 }}>Bonjour {userDisplayName} et Bienvenue sur les demandes RH !  </span><br />
 
            Veuillez sélectionner votre demande et remplir le formulaire. Vous
 
            recevrez votre demande dans les plus brefs délais. </p>
        </div>
      </div>
    </div>
  );
};
 
export default FirstBanner;