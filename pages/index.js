import Head from 'next/head'
import superagent from 'superagent'
import { useState, useEffect } from 'react'
import Collapsible from 'react-collapsible';


export default function Catalog() {

  const [series, setSeries] = useState([]);

  const triggerEpisodePlay = (series, season, index) => {
    console.log(`Now playing ${series.name} ${season.name} Episode: ${index}`);
  
    superagent.post('/api/play')
    .send({
      series: series.id,
      season: Number.parseInt(season.id),
      episode: index
    }).end(function (err, resp) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(resp);
    });
  };

  useEffect(function () {
    superagent.get('/api/catalog').end(function (err, resp) {
      if (err) {
        console.error(err);
        return;
      }

      const seriesCatalog = resp.body;
      //console.log(seriesCatalog);
      setSeries(seriesCatalog);
    });
  }, []);

  const seriesLinks = series.map(function (series) {
    const seasonList = series.seasons.map(function (season) {
      //console.log(season);

      const episodeList = season.episodes.map(function (episode, index) {
        return <li key={index}><span onClick={() => {triggerEpisodePlay(series, season, index);}}> Episode {index} </span></li>
      });

      return (<li key={season.id}>
        <Collapsible trigger={season.name}>
          <ul>
            {episodeList}
          </ul>
        </Collapsible>
      </li>);
    });

    return (
      <li key={series.id}>
        <Collapsible trigger={series.name}>
          <ul>
            {seasonList}
          </ul>
        </Collapsible>
      </li>);
  });

  return (
    <div>
      <Head>
        <title>Web Interface</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
        {seriesLinks}
      </ul>
    </div>
  )
}
