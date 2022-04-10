import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import Banner from '../components/banner';
import Card from '../components/card';
import { fetchCoffeeStores } from '../lib/coffee-store';

import useTrackLocation from '../hooks/use-track-location';
import { useEffect, useState, useContext } from "react";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores, // coffeStores: coffeeStoresx
    }, // will be passed to the page component as props
  }
}

export default function Home(props) {
  console.log('props', props);

  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } = useTrackLocation();

  const [coffeeStores, setCoffeeStores] = useState('');

  const [coffeeStoresError, setCoffeeStoresEError] = useState(null);

  console.log({ latLong, locationErrorMsg });

  useEffect(async () => {
    if (latLong) {
      try {
        const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
        console.log({fetchedCoffeeStores});
        // set coffee stores
        setCoffeeStores(fetchedCoffeeStores);
      } catch (error) {
        // set error
        console.log({error});
        setCoffeeStoresError(error.message);
      }
    }
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    console.log('hi banner button');
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffe Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner 
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} 
          handleOnClick={handleOnBannerBtnClick} 
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
              return (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              );
              })};
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
              return (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              );
              })};
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
